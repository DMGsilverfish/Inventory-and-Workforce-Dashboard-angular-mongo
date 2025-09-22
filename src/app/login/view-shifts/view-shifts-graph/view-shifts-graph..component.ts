import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Shift } from '../../../models/shift';

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
    // group by date
    const grouped: { [date: string]: Shift[] } = {};
    this.shifts.forEach(shift => {
      if (!grouped[shift.date]) grouped[shift.date] = [];
      grouped[shift.date].push(shift);
    });

    this.barChartData.labels = Object.keys(grouped);

    this.barChartData.datasets = [
      {
        label: 'Shift 1',
        data: Object.values(grouped).map(s => {
          const shift = s[0];
          return shift ? this.calculateDuration(shift) : 0;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      },
      {
        label: 'Shift 2',
        data: Object.values(grouped).map(s => {
          const shift = s[1];
          return shift ? this.calculateDuration(shift) : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }
    ];
  }

  calculateDuration(shift: Shift): number {
    if (!shift.startTime || !shift.endTime) return 0;
    const start = parseInt(shift.startTime.split(':')[0], 10);
    const end = parseInt(shift.endTime.split(':')[0], 10);
    return end - start;
  }
}
