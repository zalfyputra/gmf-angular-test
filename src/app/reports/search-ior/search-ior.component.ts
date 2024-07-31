import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import _ from 'lodash';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-ior.component.html',
  styleUrl: './search-ior.component.css'
})
export class SearchIORComponent implements OnInit {
  items: any[] = [];
  searchData = { input: '' };

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      if (!this.searchData.input) {
          const response = await axios.get("https://gmf-doa-2qimicuoja-et.a.run.app/showIORInit");
          if (response.data.status === 200) {
              this.items = response.data.showProduct;
          } else {
              console.error('Error Message:', response.data.message);
          }
      }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post("https://gmf-doa-2qimicuoja-et.a.run.app/searchIOR", this.searchData);
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
  
  navigatePreview(iorNo: string): void {
    sessionStorage.setItem('ior_init_id', iorNo);
    window.location.href = '/preview';
  }

  navigateEdit(iorNo: string): void {
    sessionStorage.setItem('ior_init_id', iorNo);
    window.location.href = '/editIOR';
  }

  search() {
    this.fetchDataBySearchTerm();
  }
}