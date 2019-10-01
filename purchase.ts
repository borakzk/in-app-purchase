import { Component  } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-purchase',
  templateUrl: 'purchase.html',
})
export class PurchasePage {

  products = []
  previousPurchases = []
  loading = true
  firstPurchase = true

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform : Platform, 
    public loadingCtrl : LoadingController,
    public iap: InAppPurchase,
    public alertCtrl: AlertController,
    public authProvider : AuthProvider) {
      platform.ready().then(() => {
        this.getSubscriptions();
      });   
  }

  ionViewWillEnter(){
    this.superTabsCtrl.showToolbar(false);
    this.authProvider.checkFirstPurchase().then((res:any) => {
      this.firstPurchase = res;
    })
    
  }

  getSubscriptions() {
    if (!this.platform.is('cordova')) { return; }
    try {
      this.iap
      .getProducts(['xapp_one','xapp_three','xapp_six'])
      .then(products => {
        this.products = products
        this.loading = false
      })
      .catch(function (err) {
        console.log('iap products errors :' + err);
      });
      console.log('try!')
    }catch (err) {
      console.log('try catch  :' + err);
    }
  }

 
  buy(selectedProd){
    this.iap.subscribe(selectedProd).then(res => {
      this.authProvider.getSubscription(selectedProd,res).then(() => {
        let alert = this.alertCtrl.create({
          message: 'Success',
          buttons: ['Success'],
          cssClass: 'alertCustomCss'
        });
        alert.present();
        this.navCtrl.pop();
      })
    }).catch(err => {
      if(err.code == -9){
        let alert = this.alertCtrl.create({
          message: 'Error',
          buttons: ['Error'],
          cssClass: 'alertCustomCss'
        });
        alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
          message: 'There is a problem',
          buttons: ['OK'],
          cssClass: 'alertCustomCss'
        });
        alert.present();
      }
    })
  }


  restorePurchased() {
    this.iap.restorePurchases().then(purchases => {
      this.previousPurchases = purchases;
      console.log(purchases)
    }).catch(err => {
      console.log('error');
    })
  }
 

}
