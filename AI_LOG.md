# AI Kullanım Günlüğü

Bu günlükte istekler ve çalışma bağlamları özetlenmiştir.
Tırnak içindeki ifadeler de birebir konuşma dökümü değil, istek özetidir.

## 1. Görev belgesinin incelenmesi ve kapsamın belirlenmesi

Araç: ChatGPT

İstek özeti:
Verilen deneme görevini incele ve deneyimsiz biri için adım adım
uygulanabilir bir yol çıkar.

Üretilen:
FocusBoard'un zorunlu özellikleri, teslim edilecek çıktılar ve
React + Vite + Electron kullanma önerisi.

Karar:
Başlangıçta düşündüğüm spor uygulamasının verilen brifle uyuşmadığını
gördüm. Teslim için FocusBoard kapsamını izlemeye karar verdim.
Bu aşamada Electron önerisi henüz uygulanmamıştı.

## 2. İlk görev ekranının hazırlanması

Araç: ChatGPT

İstek ve bağlam özeti:
Kurulum tamamlandıktan sonra görev ekranını birlikte oluşturmaya geçtik.
AI, App.jsx dosyasına yerleştirmek için React kodu sağladı.

Üretilen:
Başlık, isteğe bağlı proje etiketi ve dakika tahmini içeren görev formu.
Görev ekleme, düzenleme, tamamlama ve silme işlemleri.

Kontrol:
Tarayıcıda bir görev ekledim, başlığını düzenledim, tamamlandı durumunu
açıp kapattım ve görevi sildim. Bu işlemler çalıştı.

Bu aşamadaki eksikler:
Görevler henüz kalıcı olarak saklanmıyordu.
Zamanlayıcı, bildirimler, günlük özet ve tema seçimi henüz eklenmemişti.
Ekranın tasarımı henüz düzenlenmemişti.

Düzeltme veya ret:
Bu aşamada görev işlemlerinde tespit edilmiş bir hata veya uygulanmış
bir düzeltme yoktu.

## 3. Veri kalıcılığı

Araç: ChatGPT

İstek ve bağlam özeti:
Görevlerin sayfa yenilenince ve uygulama kapatılınca korunmasını eklemek.

Üretilen:
Görevleri localStorage'dan okuyan ve değişince kaydeden kod.
Kayıt başarısızlığını kullanıcıya gösteren mesaj.

Kontrol:
Görev ekleme, tamamlama ve silme sonrası sayfayı yenileyerek
kayıtların korunduğunu kontrol ettim.

## 4. Zamanlayıcı ve günlük özet

Araç: ChatGPT

İstek ve bağlam özeti:
Başlatma, duraklatma, devam ve iptal işlemleri olan bir zamanlayıcı
ve görev başına günlük odak özeti oluşturmak.

Üretilen:
useFocusTimer.js ve TodaySummary.jsx.
Kalan süre, kaydedilen bitiş zamanı ile mevcut saat arasından hesaplanıyor.
Tamamlanan oturumlar kaydediliyor ve günlük özette toplanıyor.

Kontrol:
Bir dakikalık oturumlarla başlatma, duraklatma, devam, tamamlama,
iptal ve sayfa yenileme denendi. İptal edilen oturum özete eklenmedi.
İki tamamlanmış oturum, özette iki dakika olarak göründü.

Düzeltme:
Bileşeni eklerken App.jsx sonunda kapanış etiketlerini yanlış
yerleştirdim. Fazladan etiketleri fark edip AI yardımıyla düzelttim.

## 5. Web ve masaüstü bildirimleri

Araç: ChatGPT

İstek ve bağlam özeti:
Oturum bitince tarayıcı ve Windows sistem bildirimi göstermek.

Üretilen:
FocusNotifications.jsx, Electron ana dosyası ve preload bağlantısı.
Arayüze yalnızca bildirim gönderme işlemi açıldı.
Masaüstü tarafında isteğin kaynağı ve görev başlığı kontrol ediliyor.

Kontrol:
Tarayıcı bildirimi geldi.
Masaüstü uygulaması küçültülmüşken sistem bildirimi geldi.
Bildirime tıklayınca uygulama açıldı.
Görevin tahmini süresi 25 dakika, odak süresi 1 dakika olduğunda
da masaüstü bildirimi geldi.

Kontrolde fark edilen:
Bazı denemelerde tarayıcı ve masaüstü pencerelerini karıştırdım.
Bildirimler bölümündeki metinle doğru sürümü ayırt edip tekrar denedim.

## 6. Bağımlılık sürümü önerisinin kontrolü

Araç: ChatGPT

İstek ve bağlam özeti:
Electron kurulumu sonrasında npm audit uyarılarını değerlendirmek.

AI önerisi ve sonuç:
AI, rapora dayanarak electron-builder 26.5.0 sürümünü önerdi.
Bu değişiklik açık sayısını 8 yüksek önem dereceli uyarıdan
13 yüksek ve 1 kritik uyarıya çıkardı.

Düzeltme:
Yeni audit sonucuna göre 26.15.3 sürümüne geçildi.
Kritik uyarı kalktı; 8 yüksek önem dereceli uyarı devam ediyor.
Bu konu henüz çözülmüş değil. npm audit fix --force uygulanmadı.

Öğrenilen:
AI'ın sürüm önerisini kabul etmek yeterli değil;
değişiklikten sonra sonucu yeniden kontrol etmek gerekiyor.

## 7. Windows kurulum dosyası

Araç: ChatGPT

İstek ve bağlam özeti:
Uygulamadan kurulabilir bir Windows dosyası üretmek.

Sorun:
Paketlemede geçici Electron klasörünün yeniden adlandırılması
EPERM hatasıyla başarısız oldu. Yeni çıktı klasörü de sorunu çözmedi.

Çözüm:
electronDist ayarıyla node_modules/electron/dist içindeki
çalışan Electron dağıtımı kullanıldı. Kurulum dosyası üretildi.

Kontrol:
Kendi Windows bilgisayarımda kurulum yapıldı.
Görev eklenip uygulama kapatıldı ve kısayoldan yeniden açıldı.
Görev korundu. Başka bir temiz bilgisayarda henüz denenmedi.

## 8. Tasarım, tema ve kod kontrolü

Araç: ChatGPT

İstek ve bağlam özeti:
Düzenli bir arayüz, dar ekran uyumu ve kalıcı açık/koyu tema eklemek.

Üretilen:
Yeni index.css ve ThemeToggle.jsx.

Kontrol:
Tema geçişi ve sayfa yenilendikten sonra tema tercihi denendi.
Dar görünüm incelendi; kesin 375 px kontrolü ayrıca tamamlanacak.

Kod kontrolü:
npm run lint, kayıt sonucunu göstermek için effect içinde yapılan
state güncellemelerini işaretledi.
Bu kullanım için iki gerekçeli satır istisnası eklendi.
İlk önerideki iki gereksiz istisna yorumu, lint uyarısı üzerine kaldırıldı.
Son npm run lint hata ve uyarı vermedi.
npm run build başarılı oldu.

Mevcut teslim durumu:
Güncel tasarımla son Windows paketi, canlı web yayını, GitHub Release,
README, ekran görüntüleri ve demo videosu henüz hazırlanmadı.
Uyku sonrası zamanlayıcı davranışı henüz denenmedi.
## 9. Bağımlılık uyarısının giderilmesi

Araç: ChatGPT

İstek ve bağlam özeti:
Teslim öncesinde kalan bağımlılık uyarılarını yeniden kontrol etmek.

Kontrol ve düzeltme:
4 Ekim'deki npm audit çıktısında http-cache-semantics için tek
yüksek önem dereceli uyarı kaldığı görüldü.
Rapor normal npm audit fix komutuyla düzeltme önerdi.
Komut çalıştırıldı ve bir paket güncellendi.

Sonuç:
npm audit: 0 bilinen güvenlik açığı.
npm run lint: hata ve uyarı yok.
npm run build: başarılı.

Bu sonuç, 6. bölümde kaydedilen açık konunun güncel durumudur.
## 10. Yayın, teslim belgeleri ve son kontroller

Araç: ChatGPT

İstek/bağlam özeti:
Web uygulamasını yayımlamak, Windows sürümünü paylaşmak,
README ve ekran görüntülerini hazırlamak, mobil görünümü
ve zamanlayıcının uyku sonrası davranışını kontrol etmek.

Üretilen:
GitHub Actions ile web derleme ve GitHub Pages yayını.
README için kurulum, kullanım, teknik kararlar ve değerlendirme metni.
Ekran görüntülerini hazırlama ve manuel kontrol adımları.

Kontrol:
Canlı web uygulaması açıldı.
Windows kurulum dosyası v1.0.0 GitHub Release'e yüklendi.
Web, masaüstü ve 375 piksel mobil görünüm görüntüleri depoya eklendi.
375 piksel görünümde incelenen bölümlerde yatay taşma görülmedi.
Windows uygulamasında bir dakikalık oturum sırasında bilgisayar
uyutuldu. 90 saniyeden uzun süre sonra uyandırıldığında sayaç
bitmişti ve sistem bildirimi geldi.

Düzeltme:
Ekran görüntülerinde eski test adları ve kesilmiş bölümler fark edildi.
Görüntü alanları düzenlenerek ilgili görüntüler yeniden alındı.

Kalan:
Demo videosunun hazırlanması, bağlantısının README'ye eklenmesi
ve teslim bağlantılarının son kontrolü.