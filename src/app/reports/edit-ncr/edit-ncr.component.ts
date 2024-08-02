import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-edit-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-ncr.component.html',
  styleUrl: './edit-ncr.component.css'
})
export class EditNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  currentNCRinitID: string | null =  null;
  ncr_data = {
    accountid: '',
    regulationbased: '',
    subject: '',
    audit_no: '',
    ncr_no: '',
    issued_date: '',
    responsible_office: '',
    audit_type: '',
    audit_scope: '',
    to_uic: '',
    attention: '',
    require_condition: '',
    level_finding: '',
    problem_analis: '',
    answer_duedate: '',
    issue_ian: '',
    ian_no: '',
    encounter_conditon: '',
    audit_by: '',
    audit_date: '',
    acknowledge_by: '',
    acknowledge_date: '',
    status: '',
    temporarylink: '',
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.currentAccountID = accountid;
      console.log('Retrieved accountid:', accountid);
    } else {
      window.location.href = '/login';
    }

    const ncrinitid = sessionStorage.getItem('ncr_init_id');
    this.currentNCRinitID = ncrinitid;
  }

  async updateNCR() {
    this.ncr_data.accountid = this.currentAccountID;
    console.log("Sending data:", this.ncr_data);
    try {
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/UpdateNCRInit', this.ncr_data);

      if (response.data.status === 200) {
        this.toastService.successToast('NCR updated successfully');
        console.log('NCR updated successfully');
      } else {
        this.toastService.failedToast('Failed to update NCR');
        console.error('Failed to update NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating NCR');
      console.error('There was an error updating NCR', error);
    }
  }
}
