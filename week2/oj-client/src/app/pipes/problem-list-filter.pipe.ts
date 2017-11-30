import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'problemListFilter'
})
export class ProblemListFilterPipe implements PipeTransform {

  transform(value: any, name: string, diff: string): any {
    if(diff){
      value = value.filter(problem => {return problem.difficulty == diff});
    }
    return value.filter(problem =>{
      return problem.name.toLowerCase().indexOf(name) !=-1;
    });
  }

}