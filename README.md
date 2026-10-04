# FocusBoard

**Canlı web uygulaması:** https://erenmeray2005-ship-it.github.io/focusboard/

**Windows indirme sayfası:** https://github.com/erenmeray2005-ship-it/focusboard/releases/tag/v1.0.0

FocusBoard, görevlerini planlamak ve odaklanarak çalışmak isteyen kişiler için hazırlanmış bir görev ve odak yönetimi uygulamasıdır. React arayüzü hem web sürümünde hem de Electron masaüstü sürümünde kullanılır.

## Özellikler

- Görev ekleme, düzenleme, tamamlama ve silme.
- İsteğe bağlı proje etiketi ve tahmini görev süresi.
- Varsayılan 25 dakika olan, değiştirilebilir odak süresi.
- Odak oturumunu başlatma, duraklatma, devam ettirme ve iptal etme.
- Oturum tamamlandığında tarayıcı veya Windows sistem bildirimi.
- Bugünkü toplam odak süresi, tamamlanan oturum sayısı ve görev başına süre.
- Görevlerin, zamanlayıcının ve tamamlanan oturumların yerel olarak saklanması.
- Kalıcı açık/koyu tema tercihi ve dar ekranlara uyarlanan arayüz.

Tahmini görev süresi ile odak oturumu süresi birbirinden bağımsızdır. Bir odak oturumunun bitmesi görevi otomatik olarak tamamlamaz; görev, kutucuğu işaretleyerek tamamlanır.

## Windows kurulumu

1. İndirme sayfasından `FocusBoard-Setup-1.0.0.exe` dosyasını indir.
2. Kurulum dosyasını çalıştır ve kurulum adımlarını tamamla.
3. FocusBoard'u masaüstü veya Başlat menüsü kısayolundan aç.

Kurulum dosyası Windows x64 içindir. Son kullanıcı bilgisayarında Node.js kurulması gerekmez.

## Yerel geliştirme

Ön gereksinimler: Node.js 24 ve npm. Depoyu komutla indirmek için Git gerekir.

```bash
git clone https://github.com/erenmeray2005-ship-it/focusboard.git
cd focusboard
npm ci
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda aç.

### Kod kontrolü ve web derlemesi

```bash
npm run lint
npm run build
```

Web çıktısı `dist` klasöründe oluşur. Derlenen web sürümünü yerel olarak incelemek için:

```bash
npm run preview
```

### Masaüstü uygulamasını çalıştırma

```bash
npm run desktop
```

Bu komut önce web arayüzünü derler, ardından Electron uygulamasını açar.

### Windows kurulum dosyası üretme

Windows üzerinde:

```bash
npm run dist:win -- --config.electronDist=node_modules/electron/dist --config.directories.output=release-local
```

Kurulum dosyası `release-local/FocusBoard-Setup-1.0.0.exe` konumunda oluşur.

Geliştirme bilgisayarında standart paketleme sırasında Electron'un geçici klasörünü yeniden adlandırma işlemi `EPERM` hatası verdi. Yukarıdaki komut, kurulu Electron dağıtımını kullanarak başarıyla paketleme sağladı.

## Kodun yapısı

- `src/App.jsx`: Görev işlemleri, form ve zamanlayıcı arayüzü.
- `src/useFocusTimer.js`: Zamanlayıcı durumu, süre hesabı ve oturum kayıtları.
- `src/TodaySummary.jsx`: Bugünkü oturumların görev başına toplanması.
- `src/FocusNotifications.jsx`: Web ve masaüstü bildirimlerinin seçilmesi.
- `src/ThemeToggle.jsx`: Tema seçimi ve tercihin saklanması.
- `src/index.css`: Arayüz tasarımı ve ekran boyutuna uyum.
- `electron-main.cjs`: Masaüstü penceresi ve Windows bildirimleri.
- `electron-preload.cjs`: Arayüzün masaüstü bildirimlerine erişmesini sağlayan sınırlı bağlantı.
- `AI_LOG.md`: AI desteği, kontroller ve yapılan düzeltmeler.

## Veri saklama ve zamanlayıcı davranışı

Veriler `localStorage` ile saklanır. Web sürümünde kullanılan tarayıcıya ve site adresine; masaüstünde Electron uygulamasının yerel profiline aittir. Web ve masaüstü verileri birbirinden bağımsızdır. Hesap, sunucu veya cihazlar arası senkronizasyon bulunmaz.

Çalışan zamanlayıcı, her saniye bir sayı azaltmak yerine kaydedilmiş bitiş zamanı ile mevcut saat arasındaki farkı hesaplar. Böylece arka planda geçen süre de hesaba katılır. Bilgisayar uykudan döndüğünde veya uygulama yeniden açıldığında durum güncellenir.

Duraklatma kalan süreyi korur. İptal edilen, henüz tamamlanmamış oturumlar günlük özete eklenmez. Oturumlar, tamamlandıkları yerel takvim gününe göre günlük özette gösterilir.

## Bildirimler ve sınırlamalar

- Web bildirimleri için tarayıcı desteği ve kullanıcı izni gerekir.
- Windows bildirimlerinin görünmesi sistemin bildirim ayarlarına bağlıdır.
- Uygulama tamamen kapalıyken veya bilgisayar uyurken o anda bildirim gönderilmez. Yeniden açılışta süre ve oturum durumu güncellenir.
- Yerel veriler temizlenirse kayıtlar kaybolabilir; bulut yedeği bulunmaz.
- Bilgisayar saatinin elle değiştirilmesi zamanlayıcı hesabını etkileyebilir.
- Windows kurulumu kendi geliştirme bilgisayarımda denendi; ayrı bir temiz bilgisayarda henüz denenmedi.

## Doğrulama

Gerçekleştirilen kontroller:

- Görev ekleme, düzenleme, tamamlama ve silme.
- Sayfa yenilendikten sonra görevlerin korunması.
- Bir dakikalık odak oturumlarıyla zamanlayıcı işlemleri.
- Tamamlanan oturumların günlük özette toplanması.
- Web ve Windows bildirimleri.
- Windows bildiriminin tıklanmasıyla uygulamanın açılması.
- Kurulu uygulamada kapatıp yeniden açtıktan sonra görev ve tema tercihinin korunması.
- Açık/koyu tema geçişi.

Son kod kontrolünde `npm run lint` hata ve uyarı vermedi, `npm run build` başarılı oldu. Son `npm audit` sonucunda bilinen bağımlılık açığı raporlanmadı.

## Otomatik web yayını

GitHub Actions, `main` dalına yapılan gönderimlerde bağımlılıkları kurar, lint kontrolünü ve web derlemesini çalıştırır. Başarılı çıktı GitHub Pages'e yayımlanır.

Windows kurulum dosyası yerel bilgisayarda üretilir ve GitHub Release'e yüklenir.

## Proje değerlendirmesi

### Teknik kararlar

React'i görev listesi, form ve zamanlayıcı gibi etkileşimli arayüz parçalarını bileşenlere ayırmak için kullandım. Vite geliştirme ve web derlemesini sağladı. Electron, aynı React arayüzünü Windows uygulamasında kullanmamı ve sistem bildirimlerine erişmemi sağladı.

Sunucu gerektirmeyen bu ilk sürümde verileri `localStorage` ile sakladım. Bu tercih kurulumu basitleştirdi; cihazlar arasında senkronizasyon sağlamıyor.

### AI kullanımından öğrendiklerim

ChatGPT'den kurulum, kod üretimi, hata yorumlama ve kontrol adımlarında destek aldım. Üretilen kodları projeye uygulayıp davranışlarını elle denedim.

Bir bağımlılık sürümü önerisi güvenlik uyarılarını artırdı. Sonucu yeniden kontrol ederek bu öneriyi değiştirdim. Ayrıca bileşenleri yerleştirirken oluşan fazladan JSX kapanış etiketlerini düzelttim. Bu örnekler, AI çıktısını doğrudan doğru kabul etmek yerine çalıştırıp kontrol etmenin gerekliliğini gösterdi.

Detaylı kayıtlar `AI_LOG.md` dosyasındadır.

### Bir hafta daha olsaydı

Zamanlayıcının önemli durumları için otomatik testler, kayıt verilerinin daha ayrıntılı doğrulanması, CSV dışa aktarma ve klavye kısayolları eklerdim. Windows kurulumunu temiz bir bilgisayarda dener, erişilebilirlik kontrollerini genişletirdim.

Cihazlar arası senkronizasyon için kullanıcı hesabı, sunucu tarafında veri saklama ve çakışan değişiklikleri yöneten bir yapı tasarlardım.