import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        console.log(header)
        switch (header) {
          case "504b0304":
          case "504b0506":
          case "504b0708":
          case "504b537058":
          case "504b4c495445":
          case "57696e5a6970":
          case"504b030414000100":
          case"52617221":
          case "504b34":
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
