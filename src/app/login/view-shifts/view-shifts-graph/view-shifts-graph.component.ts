import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
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

    // Build datasets (Shift 0 → filler before, Shift 1 → shift1, Shift 2 → gap, Shift 3 → shift2)
    const datasets = [
      {
        label: 'Before shift',
        backgroundColor: 'rgba(0,0,0,0)', // invisible
        stack: 'shifts',
        data: labels.map(date => {
          const shift1 = grouped[date][0];
          const start1 = shift1 ? this.timeToDecimal(shift1.startTime!) : 17;
          return start1 - 7; // time before first shift
        })
      },
      {
        label: 'Shift 1',
        backgroundColor: '#42A5F5',
        stack: 'shifts',
        data: labels.map(date => {
          const shift1 = grouped[date][0];
          if (!shift1) return 0;
          return this.timeToDecimal(shift1.endTime!) - this.timeToDecimal(shift1.startTime!);
        })
      },
      {
        label: 'Gap',
        backgroundColor: 'rgba(0,0,0,0)', // invisible
        stack: 'shifts',
        data: labels.map(date => {
          const shift1 = grouped[date][0];
          const shift2 = grouped[date][1];
          if (!shift1 || !shift2) return 17 - 7; // fill to end if no second shift
          return this.timeToDecimal(shift2.startTime!) - this.timeToDecimal(shift1.endTime!);
        })
      },
      {
        label: 'Shift 2',
        backgroundColor: '#66BB6A',
        stack: 'shifts',
        data: labels.map(date => {
          const shift2 = grouped[date][1];
          if (!shift2) return 0;
          return this.timeToDecimal(shift2.endTime!) - this.timeToDecimal(shift2.startTime!);
        })
      }
    ];

    const ctx = (document.getElementById('shiftsChart') as HTMLCanvasElement).getContext('2d');

    this.chart = new Chart(ctx!, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Employee Shifts Timeline' },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                if (context.dataset.label === 'Shift 1' || context.dataset.label === 'Shift 2') {
                  return `${context.dataset.label}: ${context.raw}h`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: 'Days' }
          },
          y: {
            stacked: true,
            min: 0,
            max: 17 - 7, // always 10h (7 to 17)
            ticks: {
              stepSize: 1,
              callback: (val: string | number) => {
                if (typeof val === 'number') {
                  const hours = val + 7;
                  return `${hours.toString().padStart(2, '0')}:00`;
                }
                return val; // fallback if string
              }
            },
            title: { display: true, text: 'Time of Day' }
          }
        }
      }
    });
  }

  private timeToDecimal(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h + (m || 0) / 60;
  }
}
