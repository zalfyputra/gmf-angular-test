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
  selector: 'app-search-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-ior.component.html',
  styleUrls: ['./search-ior.component.css']
})
export class SearchIORComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  items: any[] = [];
  searchData = { input: '' };

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('https://gmf-doa-2qimicuoja-et.a.run.app/showOccurrenceAll');
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
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/searchIOR', this.searchData);
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
    const fileName = `IOR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigatePreview(documentId: string) {
    try {
      sessionStorage.setItem('document_id', documentId);
      console.log(documentId);
      // Show the generating toast
      const generatingToastElement = this.toastService.generatingToast('Generating IOR Document');
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/getPDFDrive', {documentId});
      console.log(response.data.message);
      document.body.removeChild(generatingToastElement);
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
    window.location.href = 'Edit_IOR_2.html';
  }

  search() {
    this.fetchDataBySearchTerm();
  }
}