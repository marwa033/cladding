import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'app/dashboard/clients/client.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerService } from 'ngx-spinner';
import { PromocodesService } from '../promocodes.service';

@Component({
  selector: 'ms-add-promo',
  templateUrl: './add-promo.component.html',
  styleUrls: ['./add-promo.component.scss']
})
export class AddPromoComponent implements OnInit {
  code;
  days;
  total;
  max;
  amount;
  type;
  for;
  client;
  vendor;
  startDate;  
  date;
  clients: any;
  allClients: boolean = false;
  allVendors: boolean = false;
  vendors: any;
  vendorMulti;
  clientMulti:[];
  updateFlag: boolean = false;
  results: any;
  id;
  promo: any;
  minDate = new Date()
  
  constructor(private imageCompress: NgxImageCompressService,
    public promoService: PromocodesService,
    public clientService: ClientService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.Clients();
    this.Mechanical();
    
    this.route.params.subscribe(params => {
      this.id = params.id
      if(this.id != undefined){
        this.updateFlag = true
        this.spinner.show()
      }
      this.promoService.GetById(this.id).
      then( response => { this.promo = response;
        setTimeout(() => {
          this.spinner.hide();
        }, this.promo);
        console.log(this.promo)
        this.code = this.promo.code;
        this.days = this.promo.daysPeriod;
        this.total = this.promo.totalUsage;
        // this.startDate = this.promo.startDate;
        
        this.startDate = new Date( this.promo.startDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
        this.max =this.promo.maxNumberOfUses;
        this.amount = this.promo.amount;
        this.type = this.promo.type;
        this.for = this.promo.for;
        this.client = this.promo.forAllClients;
        this.clientBoolen(this.client)
        this.vendor = this.promo.forAllVendors;
        this.vendorBoolen(this.vendor)
        this.clientMulti = this.promo.clientIds;
        this.vendorMulti = this.promo.vendorIds;
        console.log(this.vendorMulti)        
        // this.promo.vendorIds.forEach(element => {
        //   this.vendorMulti.push(element)
        // });
      });
    })
  }

  Clients(){
    this.clientService.Get().
        then( response => { this.clients = response.data;
             })
  }
  Mechanical(){
    //  this.mechanicalService.Get().
    //    then( response => { this.vendors = response.data;
    //  })
  }
  clientBoolen(event){
    console.log(event)
    if(event === false){
      this.allClients = true
    }else{
      this.allClients = false
    }
  }
  vendorBoolen(event){
    console.log(event)
    if(event === false){
      this.allVendors = true
    }else{
      this.allVendors = false
    }
  }

  Add(value){
    let date = new DatePipe('en-Us').transform(this.startDate, 'dd-MM-yyyy');
    this.spinner.show()
    console.log(this.updateFlag)
    if(this.updateFlag === false){
    this.promoService.Add(value, date).
        then( response => { this.results = response;
         });
        }else{
          this.promoService.Update(value,this.id, date).
             then( response => { this.results = response;
               });
       }
       setTimeout(() => {
        this.spinner.hide();
      }, this.results);
  
  } 
}
