import { Subject } from 'rxjs';

const subjectCount = new Subject();
const subjectValue = new Subject();

export const progressBarService = {
    sendStatus: value => subjectValue.next({ number: value }),
    clearStatus: () => subjectValue.next(),
    getStatus: () => subjectValue.asObservable(),

    sendItemCount: count => subjectCount.next({ number: count }),
    clearItemCount: () => subjectCount.next(),
    getItemCount: () => subjectCount.asObservable()
};