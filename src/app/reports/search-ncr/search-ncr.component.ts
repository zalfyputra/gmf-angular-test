import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { response } from 'express';
import { ToastService } from '../../toast.service';


@Component({
  selector: 'app-search-ncr',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-ncr.component.html',
  styleUrls: ['./search-ncr.component.css']
})
export class SearchNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  items: any[] = [];
  searchData = { input: '' };

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('https://gmf-doa-2qimicuoja-et.a.run.app/showNCRInit');
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/searchNCR', this.searchData);
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
    }
  }

  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const fileName = `NCR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigatePreview(documentId: string) {
    try {
      sessionStorage.setItem('document_id', documentId);
      console.log(documentId);
      // Show the generating toast
      const generatingToastElement = this.toastService.generatingToast('Generating NCR Document');
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/getPDFDrive', {documentId});
      document.body.removeChild(generatingToastElement);
      console.log(response.data.message);
      if (response.data.status === 200) {
        window.location.href = response.data.message;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  navigateEdit(documentId: string) {
    sessionStorage.setItem('document_id', documentId);
    window.location.href = 'Edit_NCR_2.html';
  }

  search() {
    this.fetchDataBySearchTerm();
  }
}