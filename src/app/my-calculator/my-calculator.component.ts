import { Component } from '@angular/core';
import {group} from "@angular/animations";

interface CalcGroup {
  first: CalcVar;
  second: CalcVar;
  operation: CalcOperations;
}

interface CalcVar {
  value: number;
  modification: CalcModifiers;
}

enum CalcOperations {
  Plus = '+',
  minus = '-',
  multiply = '*',
  divide = '/',
}

enum CalcModifiers {
  none = 'none',
  sin = 'sin',
  cos = 'cos',
  square = 'square',
}



@Component({
  selector: 'app-my-calculator',
  templateUrl: './my-calculator.component.html',
  styleUrls: ['./my-calculator.component.scss']
})
export class MyCalculatorComponent {
  public calcOperations = CalcOperations;

  public calcModifiers = CalcModifiers;

  public calcGroups: CalcGroup[] = [
    {
      first: {
        value: 5,
        modification: CalcModifiers.none
      },
      second: {
        value: 5,
        modification: CalcModifiers.none
      },
      operation: this.calcOperations.Plus
    },
  ];

  public history: string[] = [];

  public operationsBetweenGroups: CalcOperations[] = [];

  public result?: number;

  public addGroup(): void {
    this.calcGroups.push({
      first: {
        value: 0,
        modification: CalcModifiers.none,
      },
      second: {
        value: 0,
        modification: CalcModifiers.none,
      },
      operation: CalcOperations.Plus
    })

    this.operationsBetweenGroups.push(CalcOperations.Plus);
  };

  public removeGroup(index: number): void {
    this.calcGroups.splice(index, 1);
  }

  public calcGroup() {

    let result = 0;

    let tempHistory: string[] = [];

    this.calcGroups.forEach((group, i) => {
      if (i === 0) {
        result = this.calculate(
          this.calcValueWithModification(group.first),
          this.calcValueWithModification(group.second),
          group.operation
        )
      } else {
        let tempResult = this.calculate(
          this.calcValueWithModification(group.first),
          this.calcValueWithModification(group.second),
          group.operation
          )
        result = this.calculate(result, tempResult, this.operationsBetweenGroups[i - 1])
        }

      tempHistory.push(
        `(
        ${group.first.modification !== CalcModifiers.none ? group.first.modification : ''}
        ${group.first.value}
        ${group.operation}
        ${group.second.modification !== CalcModifiers.none ? group.second.modification : ''}
        ${group.second.value}
        )
        `
      )
    })

    tempHistory.push(`= ${result}`);
    this.history.push(tempHistory.join(' '));

    this.result = result;
  };

  public calcValueWithModification(value: CalcVar) {
    switch (value.modification) {
      case CalcModifiers.none:
        return value.value;
      case CalcModifiers.cos:
        return Math.cos(value.value);
      case CalcModifiers.sin:
        return Math.sin(value.value);
      case CalcModifiers.square:
        return Math.pow(value.value, 2);
    }
  }

  public calculate(first: number, second: number, operation: CalcOperations): number {
    switch (operation) {
      case CalcOperations.Plus:
        return first + second;
      case CalcOperations.minus:
        return first - second;
      case CalcOperations.multiply:
        return first * second;
      case CalcOperations.divide:
        return first / second;
    }
  }
}
