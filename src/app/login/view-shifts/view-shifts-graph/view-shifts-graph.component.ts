import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { Shift } from '../../../models/shift';

// ✅ Register everything once
Chart.register(...registerables);

@Component({
  selector: 'app-view-shifts-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './view-shifts-graph.component.html',
  styleUrls: ['./view-shifts-graph.component.css']
})
export class ViewShiftsGraphComponent implements OnChanges {
  @Input() shifts: Shift[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        min: 7,
        max: 17,
        title: { display: true, text: 'Hour of Day' }
      }
    }
  };

  ngOnChanges() {
    if (this.shifts.length > 0) {
      this.buildChart();
    }
  }

  buildChart() {
    // 🔹 Group shifts by date
    const grouped: { [date: string]: Shift[] } = {};
    this.shifts.forEach(shift => {
      if (!grouped[shift.date]) grouped[shift.date] = [];
      grouped[shift.date].push(shift);
    });

    const dates = Object.keys(grouped).sort();
    this.barChartData.labels = dates;

    // 🔹 Convert each shift into start and duration for stacked bars
    const shift1Data: { x: string; y: number[] }[] = [];
    const shift2Data: { x: string; y: number[] }[] = [];

    dates.forEach(date => {
      const shifts = grouped[date];
      if (shifts[0]) {
        const start = this.toHour(shifts[0].startTime);
        const end = this.toHour(shifts[0].endTime);
        shift1Data.push({ x: date, y: [start, end] });
      }
      if (shifts[1]) {
        const start = this.toHour(shifts[1].startTime);
        const end = this.toHour(shifts[1].endTime);
        shift2Data.push({ x: date, y: [start, end] });
      }
    });

    this.barChartData.datasets = [
      {
        label: 'Shift 1',
        data: shift1Data.map(s => s.y[1] - s.y[0]), // duration
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      },
      {
        label: 'Shift 2',
        data: shift2Data.map(s => s.y[1] - s.y[0]), // duration
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }
    ];

    console.log('Chart data:', this.barChartData);
  }

  // 🔹 Convert "HH:mm" or "HH.mm" to float hour
  toHour(time?: string): number {
    if (!time) return 0;
    const parts = time.includes(':') ? time.split(':') : time.split('.');
    const hour = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || '0', 10);
    return hour + minutes / 60;
  }
}
