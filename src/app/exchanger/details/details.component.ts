import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { concatMap } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  homeData: any;
  previousYearDataList: Array<string> = [];
  subscriptions$!: Subscription;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 1
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
    ]
  };

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.api.showDetails$.next(false);
    const data = this.route.snapshot.queryParams.val;
    this.homeData = JSON.parse(data);
    console.log('details data', this.homeData);
    this.getPastYearMonthlyData();
    this.subscriptions$ = this.api.fromValueChanges$.subscribe(res => {
      if (res) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>From Value changes', res);
        this.homeData.to = res;
        this.getPastYearMonthlyData();
      }
    })
  }

  getPastYearMonthlyData(): void{
    const currentYear = new Date().getFullYear() - 1;
    const prevDateArr: any = [];
    const param = [this.homeData.from, this.homeData.to].toString();
    for (let i = 1; i <= 12; i++) {
      prevDateArr.push(this.getFormattedDate(currentYear, i));
    }
    this.api.getPastYearData(prevDateArr[0], param).pipe(
      concatMap(data => forkJoin([
        this.api.getPastYearData(prevDateArr[0], param),
        this.api.getPastYearData(prevDateArr[1], param),
        this.api.getPastYearData(prevDateArr[2], param),
        this.api.getPastYearData(prevDateArr[3], param),
        this.api.getPastYearData(prevDateArr[4], param),
        this.api.getPastYearData(prevDateArr[5], param),
        this.api.getPastYearData(prevDateArr[6], param),
        this.api.getPastYearData(prevDateArr[7], param),
        this.api.getPastYearData(prevDateArr[8], param),
        this.api.getPastYearData(prevDateArr[9], param),
        this.api.getPastYearData(prevDateArr[10], param),
        this.api.getPastYearData(prevDateArr[11], param)
      ]))
    ).subscribe(responseList => {
      this.previousYearDataList.push(responseList[0]);
      this.previousYearDataList.push(responseList[1]);
      this.previousYearDataList.push(responseList[2]);
      this.previousYearDataList.push(responseList[3]);
      this.previousYearDataList.push(responseList[4]);
      this.previousYearDataList.push(responseList[5]);
      this.previousYearDataList.push(responseList[6]);
      this.previousYearDataList.push(responseList[7]);
      this.previousYearDataList.push(responseList[8]);
      this.previousYearDataList.push(responseList[9]);
      this.previousYearDataList.push(responseList[10]);
      this.previousYearDataList.push(responseList[11]);
      const dataSet1: any = [];
      // const dataSet2: any = [];
      this.previousYearDataList.forEach((element: any) => {
         dataSet1.push(element.rates[this.homeData.to])
        //  dataSet2.push(element.rates[this.homeData.to]);
      });
      this.barChartData.datasets[0].data = dataSet1;
      this.barChartData.datasets[0].label = this.homeData.to;
      // this.barChartData.datasets[1].data = dataSet2;
      // this.barChartData.datasets[1].label = this.homeData.to;
      console.log('checkBarChartData', this.barChartData);
      this.chart?.update();
    })
  }

  getFormattedDate(year: number, month: number): string{
    const newDate = new Date(year, month, 0);
    const yyyy = newDate.getFullYear();
    const mm = (newDate.getMonth() + 1) < 10 ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1);
    const dd = newDate.getDate();
    return `${yyyy}-${mm}-${dd}`;
  }

  ngOnDestroy(): void {
    try {
      this.subscriptions$.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

}
