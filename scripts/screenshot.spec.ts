import { test } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const routes = [
  ['login','/login'],['dashboard','/'],['keuangan-transaksi','/keuangan/transaksi'],
  ['buku-kas','/keuangan/buku-kas'],['laporan','/keuangan/laporan'],['donasi','/keuangan/donasi'],
  ['anggaran','/keuangan/anggaran'],['jadwal-sholat','/jadwal/sholat'],['imam-khatib','/jadwal/imam-khatib'],
  ['agenda','/agenda'],['jamaah','/jamaah'],['zis','/zis'],['qurban','/qurban'],
  ['pengumuman','/pengumuman'],['inventaris','/inventaris'],['operasional','/operasional'],
  ['ramadhan','/ramadhan'],['tpq','/tpq'],['pengaturan','/pengaturan'],['publik','/publik'],['layar-masjid','/publik/layar'],
];
test('screenshots', async ({ page }) => {
  await page.goto(BASE+'/login',{waitUntil:'networkidle'});
  await page.evaluate(()=>{localStorage.setItem('masjid-auth', JSON.stringify({state:{user:{id:'u1',nama:'Admin',email:'admin@masjid.app',role:'SUPER_ADMIN'},isAuthenticated:true},version:0}))});
  for(const [name,path] of routes){
    try{
      await page.goto(BASE+path,{waitUntil:'networkidle',timeout:30000});
      await page.waitForTimeout(1200);
      await page.setViewportSize({width:1440,height:900});
      await page.screenshot({path:`docs/screenshots/${name}-desktop.png`,fullPage:true});
      await page.setViewportSize({width:375,height:812});
      await page.screenshot({path:`docs/screenshots/${name}-mobile.png`});
      console.log('ok',name);
    }catch(e){console.log('fail',name,String(e).slice(0,200));}
  }
});