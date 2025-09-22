import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { Shift } from '../../../models/shift';

Chart.register(...registerables);

@Component({
  selector: 'app-view-shifts-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-shifts-graph.component.html',
  styleUrls: ['./view-shifts-graph.component.css']
})
export class ViewShiftsGraphComponent implements OnChanges {
  @Input() shifts: Shift[] = [];
  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shifts']) {
      this.createChart();
    }
  }

  private createChart() {
    if (this.chart) this.chart.destroy();

    // Group shifts by date
    const grouped: { [date: string]: Shift[] } = {};
    this.shifts.forEach(shift => {
      if (!grouped[shift.date]) grouped[shift.date] = [];
      grouped[shift.date].push(shift);
    });

    const labels = Object.keys(grouped).sort();

    // Prepare datasets (max 2 shifts per day)
    const datasets = [0, 1].map(i => {
      return {
        label: `Shift ${i + 1}`,
        backgroundColor: i === 0 ? '#42A5F5' : '#66BB6A',
        stack: 'shifts',
        data: labels.map(date => {
          const shift = grouped[date][i];
          if (!shift) return 0;

          const start = this.timeToDecimal(shift.startTime!);
          const duration = this.timeToDecimal(shift.endTime!) - start;

          return {
            x: start,       // position of the bar
            y: date,        // the label on y-axis
            x2: start + duration, // end of bar
            startTime: shift.startTime,
            endTime: shift.endTime
          };
        })
      };
    });

    const ctx = (document.getElementById('shiftsChart') as HTMLCanvasElement).getContext('2d');

    this.chart = new Chart(ctx!, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        indexAxis: 'y', // horizontal bars
        responsive: true,
        plugins: {
          title: { display: true, text: 'Employee Shifts Timeline' },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const raw = context.raw;
                return raw.startTime && raw.endTime
                  ? `Shift: ${raw.startTime} - ${raw.endTime}`
                  : '';
              }
            }
          }
        },
        scales: {
          x: {
            min: 7,   // X-axis starts at 7:00
            max: 17,  // X-axis ends at 17:00
            title: { display: true, text: 'Time (hours)' }
          },
          y: { stacked: true }
        }
      }
    });
  }

  private timeToDecimal(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h + (m || 0) / 60;
  }
}
