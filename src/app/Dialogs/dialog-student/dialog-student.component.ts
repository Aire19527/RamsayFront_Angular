import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseDto } from 'src/app/Models/response.dto';

import { StudentModel } from 'src/app/Models/student.model';
import { StudentService } from 'src/app/Services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-student',
  templateUrl: './dialog-student.component.html',
  styleUrls: ['./dialog-student.component.css'],
})
export class DialogStudentComponent implements OnInit {
  formStudent: FormGroup;
  action: string = 'New Student';
  buttonAction: string = 'Save';

  constructor(
    private dialogRef: MatDialogRef<DialogStudentComponent>,
    private formB: FormBuilder,
    private _snackBar: MatSnackBar,
    private _studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) public dataStudent: StudentModel
  ) {
    this.formStudent = this.formB.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      career: ['', Validators.required],
      age: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.dataStudent) {
      this.action = 'Edit Student';
      this.formStudent.patchValue({
        username: this.dataStudent.username,
        firstName: this.dataStudent.firstName,
        lastName: this.dataStudent.lastName,
        career: this.dataStudent.career,
        age: this.dataStudent.age,
      });

      this.buttonAction = 'Edit';
    }
  }

  showAlert(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  saveStudent() {
    console.log(this.formStudent.value);

    var model: StudentModel = {
      id: 1,
      age: this.formStudent.value.age,
      username: this.formStudent.value.username,
      firstName: this.formStudent.value.firstName,
      lastName: this.formStudent.value.lastName,
      career: this.formStudent.value.career,
    };

    if (this.dataStudent == null) {
      this._studentService.insert(model).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.showAlert(data.message, 'OK');
            this.dialogRef.close('created');
          } else {
            this.showAlert(data.message, 'Alert');
          }
        },
        error: (e) => {
          console.error(e);
          const error = e.error as ResponseDto;
          Swal.fire('Opps!', error.message, 'error');
        },
      });
    } else {
      model.id = this.dataStudent.id;
      this._studentService.update(model).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.showAlert(data.message, 'OK');
            this.dialogRef.close('edited');
          } else {
            this.showAlert(data.message, 'Alert');
          }
        },
        error: (e) => {
          console.error(e);
          const error = e.error as ResponseDto;
          Swal.fire('Opps!', error.message, 'error');
        },
      });
    }
  }
}
