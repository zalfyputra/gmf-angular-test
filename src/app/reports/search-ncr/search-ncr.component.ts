import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

@Component({
  selector: 'app-search-ncr',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-ncr.component.html',
  styleUrls: ['./search-ncr.component.css']
})
export class SearchNCRComponent implements OnInit {
  items: any[] = [];
  searchData = { input: '' };
  searchTerm: string = ''; // Define searchTerm here
  filterBy: string = 'all'; // Default filter
  showFilters: boolean = false; // Toggle for filter visibility
  
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
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/searchNCR', {
        ...this.searchData,
        filterBy: this.filterBy // Include filter criteria in the request
      });
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
      const response = await axios.post('https://gmf-doa-2qimicuoja-et.a.run.app/getPDFDrive', { documentId });
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

  navigateEdit(ncr_init_id: string) {
    sessionStorage.setItem('ncr_init_id', ncr_init_id);
    window.location.href = '/editNCR';
  }

  search() {
    this.fetchDataBySearchTerm();
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  // Add this method to handle view details functionality
  viewDetails(documentId: string) {
    sessionStorage.setItem('document_id', documentId);
    window.location.href = 'details-NCR.html'; // Change this to the actual path where details are displayed
  }
}
