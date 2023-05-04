import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StudentModel } from 'src/app/Models/student.model';
import { StudentService } from 'src/app/Services/student.service';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogStudentComponent } from 'src/app/Dialogs/dialog-student/dialog-student.component';
import Swal from 'sweetalert2';
import { ResponseDto } from 'src/app/Models/response.dto';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'UserName',
    'FirstName',
    'LastName',
    'Age',
    'Career',
    'Options',
  ];
  dataSource = new MatTableDataSource<StudentModel>();
  listEstudent: StudentModel[] = [];

  constructor(
    private _studentService: StudentService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showAllStudent();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showAllStudent() {
    this._studentService.getAll().subscribe({
      next: (dataResponse) => {
        console.log(dataResponse);

        this.dataSource.data = dataResponse.result as StudentModel[];
        console.log(dataResponse.result as StudentModel[]);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  dialogNewStudent() {
    this.dialog
      .open(DialogStudentComponent, {
        disableClose: true,
        width: '30%',
      })
      .afterClosed()
      .subscribe((result) => {
        console.warn(result);
        if (result == 'created') {
          this.showAllStudent();
        }
      });
  }

  dialogEditStudent(element: StudentModel) {
    console.log(element);
    this.dialog
      .open(DialogStudentComponent, {
        disableClose: true,
        width: '30%',
        data: element,
      })
      .afterClosed()
      .subscribe((result) => {
        console.warn(result);
        if (result == 'edited') {
          this.showAllStudent();
        }
      });
  }

  deleteStuden(element: StudentModel) {
    Swal.fire({
      title: 'Confirm Delete?',
      text: 'You will not be able to reverse this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._studentService.delete(element.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              Swal.fire('OK!', data.message, 'success');
              this.showAllStudent();
            } else {
              Swal.fire('Alerta!', data.message, 'warning');
            }
          },
          error: (e) => {
            console.error(e);
            const error = e.error as ResponseDto;
            Swal.fire('Opps!', error.message, 'error');
          },
        });
      }
    });
    console.warn(element);
  }
}
