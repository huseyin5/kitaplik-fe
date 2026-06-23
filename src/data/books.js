// Reading-status metadata shared by badges, pills and filters.
export const STATUS_META = {
  okunacak: { label: 'Okunacak', className: 'st-okunacak' },
  okunuyor: { label: 'Okunuyor', className: 'st-okunuyor' },
  okundu: { label: 'Okundu', className: 'st-okundu' },
}

export const STATUS_ORDER = ['okunacak', 'okunuyor', 'okundu']

// Local book catalog. The app runs entirely in the browser — search filters
// this list and the library is kept in localStorage; there is no backend.
export const CATALOG = [
  { id: 'b1', title: 'Kürk Mantolu Madonna', authors: ['Sabahattin Ali'], isbn: '9789753638029', publisher: 'Yapı Kredi Yayınları', publishedDate: '1943', pageCount: 160, description: 'Berlin’de geçen, içe dönük bir adamın unutamadığı bir aşkın izini süren modern Türk edebiyatının en sevilen klasiklerinden.' },
  { id: 'b2', title: 'Tutunamayanlar', authors: ['Oğuz Atay'], isbn: '9789754701166', publisher: 'İletişim Yayınları', publishedDate: '1971', pageCount: 724, description: 'Türk romanının dönüm noktası; biçimsel cesareti ve derin ironisiyle bir başyapıt olarak kabul edilir.' },
  { id: 'b3', title: 'Saatleri Ayarlama Enstitüsü', authors: ['Ahmet Hamdi Tanpınar'], isbn: '9789759952853', publisher: 'Dergâh Yayınları', publishedDate: '1961', pageCount: 384, description: 'Doğu ile Batı arasında sıkışmış bir toplumun zaman ve modernleşmeyle imtihanını anlatan ironik bir roman.' },
  { id: 'b4', title: 'İnce Memed', authors: ['Yaşar Kemal'], isbn: '9789750802691', publisher: 'Yapı Kredi Yayınları', publishedDate: '1955', pageCount: 432, description: 'Çukurova’da ağalara başkaldıran bir gencin destansı hikâyesi; halk anlatısının güçlü bir örneği.' },
  { id: 'b5', title: 'Benim Adım Kırmızı', authors: ['Orhan Pamuk'], isbn: '9789750718686', publisher: 'İletişim Yayınları', publishedDate: '1998', pageCount: 472, description: '16. yüzyıl İstanbul’unda nakkaşlar arasında geçen, katmanlı bir cinayet ve sanat romanı.' },
  { id: 'b6', title: 'Aylak Adam', authors: ['Yusuf Atılgan'], isbn: '9789750826436', publisher: 'Yapı Kredi Yayınları', publishedDate: '1959', pageCount: 160, description: 'Kalabalıkta yalnız bir adamın “gerçek” sevgiyi arayışını işleyen modernist bir başyapıt.' },
  { id: 'b7', title: 'Serenad', authors: ['Zülfü Livaneli'], isbn: '9786050900010', publisher: 'Doğan Kitap', publishedDate: '2011', pageCount: 480, description: 'Tarih, aşk ve kimlik üzerine kurulu, sürükleyici ve çok katmanlı bir roman.' },
  { id: 'b8', title: 'Şeker Portakalı', authors: ['José Mauro de Vasconcelos'], isbn: '9789750726316', publisher: 'Can Yayınları', publishedDate: '1968', pageCount: 182, description: 'Yoksul ama hayal gücü zengin küçük Zezé’nin yürek burkan büyüme öyküsü.' },
  { id: 'b9', title: '1984', authors: ['George Orwell'], isbn: '9789750718533', publisher: 'Can Yayınları', publishedDate: '1949', pageCount: 352, description: 'Gözetim ve baskı altındaki bir distopyada bireyin özgürlük arayışını anlatan kült roman.' },
  { id: 'b10', title: 'Simyacı', authors: ['Paulo Coelho'], isbn: '9789750726279', publisher: 'Can Yayınları', publishedDate: '1988', pageCount: 184, description: 'Kişisel menkıbesinin peşine düşen genç çoban Santiago’nun ilham veren yolculuğu.' },
  { id: 'b11', title: 'Sapiens', authors: ['Yuval Noah Harari'], isbn: '9786050204063', publisher: 'Kolektif Kitap', publishedDate: '2011', pageCount: 408, description: 'İnsan türünün biyolojik ve kültürel evrimine dair geniş ölçekli, kışkırtıcı bir anlatı.' },
  { id: 'b12', title: 'Körlük', authors: ['José Saramago'], isbn: '9786051983646', publisher: 'Kırmızı Kedi', publishedDate: '1995', pageCount: 328, description: 'Ani bir körlük salgınının toplumu çözüşe sürüklediği sarsıcı bir alegori.' },
  { id: 'b13', title: 'Yüzyıllık Yalnızlık', authors: ['Gabriel García Márquez'], isbn: '9789750726224', publisher: 'Can Yayınları', publishedDate: '1967', pageCount: 448, description: 'Buendía ailesinin yedi kuşağı üzerinden büyülü gerçekçiliğin başyapıtı.' },
  { id: 'b14', title: 'Beyaz Geceler', authors: ['Fyodor Dostoyevski'], isbn: '9786053609605', publisher: 'Türkiye İş Bankası Kültür Yayınları', publishedDate: '1848', pageCount: 96, description: 'Petersburg’un beyaz gecelerinde geçen, hüzünlü ve şiirsel bir aşk hikâyesi.' },
]
