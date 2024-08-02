import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-followon-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './followon-ior.component.html',
  styleUrl: './followon-ior.component.css'
})
export class FollowonIORComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  followior_data = {
    id_IOR: '',
    follup_detail: '',
    follupby: '',
    follup_uic: '',
    follup_date: '',
    follup_datarefer: '',
    follup_status: '',
    nextuic_follup: '',
    current_probability: '',
    current_severity: '',
    current_riskindex: '',
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.currentAccountID = accountid;
      console.log('Retrieved accountid:', accountid);
      this.getAccountInfo();
    } else {
      window.location.href = '/login';
    }
  }

  account: any = {};

  async getAccountInfo() {
    try {
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/showAccount', { accountid: this.currentAccountID });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  async submitFollowIOR() {
    try {
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/addFollowUpOccurrence', this.followior_data);

      if (response.data.status === 200) {
        this.toastService.successToast('Follow on IOR added successfully');
        console.log('Follow on IOR added successfully');
      } else {
        this.toastService.failedToast('Failed to add Follow on IOR');
        console.error('Failed to add Follow on IOR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Follow on IOR');
      console.error('There was an error adding Follow on IOR', error);
    }
  }
}
