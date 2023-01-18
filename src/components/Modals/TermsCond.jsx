import {
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TermsCond = (props) => {
  const { open, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "0.95rem" }}>
        <div>
          <Typography fontWeight={700}>
            Aplikasi Mobile Care Center 165
          </Typography>
          <Typography fontSize={14}>
            Syarat dan Ketentuan Aplikasi Mobile Care Center 165 BPJS Kesehatan
          </Typography>
        </div>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Box
        sx={{ backgroundColor: "#f4f4f4", height: "400px", padding: "20px" }}
      >
        <Typography fontWeight={700} fontSize={14}>
          A. DEFINISI
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          1.{" "}
          <span style={{ fontWeight: 700 }}>
            Aplikasi Mobile Care Center 165
          </span>
          , selanjutnya disebut{" "}
          <span style={{ fontWeight: 700 }}>Aplikasi</span>, adalah aplikasi
          berbasis mobile yang dapat diunduh oleh peserta Jaminan Kesehatan
          Nasional atau non peserta JKN dari gawai (gadget) untuk menghubungi
          Care Center 165 secara online melalui Voice over Internet Protocol
          (VoIP) call, e-mail, chat, dan media sosial.
          {/* 1.Dengan menggunakan layanan Click to Dial ini, maka anda telah
          menyetujui bahwa percakapan anda kami rekam. */}
        </Typography>
        <Typography fontSize={12}>
          2. <span style={{ fontWeight: 700 }}>Pengguna</span> adalah pihak yang
          menggunakan Aplikasi
          {/* 2.Petugas berhak untuk mengakhiri percakapan lebih awal jika dalam
          interaksi terdapat unsur SARA, Seksual, dan perbuatan tidak
          menyenangkan. */}
        </Typography>
        <Typography fontSize={12}>
          3. <span style={{ fontWeight: 700 }}>Pengguna Terdaftar</span> adalah
          Pengguna yang telah melakukan registrasi pada Aplikasi
          {/* 2.Petugas berhak untuk mengakhiri percakapan lebih awal jika dalam
          interaksi terdapat unsur SARA, Seksual, dan perbuatan tidak
          menyenangkan. */}
        </Typography>
        <Typography fontSize={12}>
          4. Kartu Indonesia Sehat/ KIS adalah kartu yang diterbitkan oleh BPJS
          Kesehatan
          {/* 2.Petugas berhak untuk mengakhiri percakapan lebih awal jika dalam
          interaksi terdapat unsur SARA, Seksual, dan perbuatan tidak
          menyenangkan. */}
        </Typography>
        <Typography fontSize={12}>
          5. <span style={{ fontWeight: 700 }}>Password Aplikasi</span> adalah
          kode identifikasi pribadi berupa alfanumerik yang ditentukan sendiri
          oleh Pengguna Terdaftar dan wajib dimasukkan setiap kali Pengguna
          Terdaftar mengakses data nasabah dan menu-menu lain pada Aplikasi yang
          ditentukan dan yang akan diberitahukan oleh BPJS Kesehatan dari waktu
          ke waktu.
        </Typography>
        <br></br>
        <Typography fontWeight={700} fontSize={14}>
          B. REGISTRASI DAN AKTIVASI APLIKASI
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          1. Untuk menggunakan Aplikasi, Pengguna harus terlebih dahulu
          mengunduh Aplikasi pada gawai (gadget) dengan operating system yang
          ditentukan BPJS Kesehatan.
        </Typography>
        <Typography fontSize={12}>
          2. Pengguna dapat menggunakan Aplikasi dengan 2 (dua) cara:
        </Typography>
        <Typography fontSize={12} marginLeft={2}>
          1. Melalui menu Registrasi Pada menu ini, Pengguna harus terlebih
          dahulu melakukan proses registrasi dengan meng- input data milik
          Pengguna antara lain nomor kartu Indonesia Sehat (KIS) BPJS
          Kesehatan/Kartu Penduduk milik Pengguna di BPJS Kesehatan dan Password
          Aplikasi, untuk selanjutnya mendapatkan OTP yang akan dikirimkan oleh
          BPJS Kesehatan ke nomor handphone Pengguna yang terdaftar di BPJS
          Kesehatan. Atas pengiriman OTP tersebut, Pengguna akan dikenakan biaya
          SMS sesuai dengan tarif yang berlaku di masing-masing penyedia jasa
          telekomunikasi.
        </Typography>
        <Typography fontSize={12} marginLeft={2}>
          2. Melalui menu Guest. Pada menu ini, Pengguna dapat langsung
          menggunakan Aplikasi tanpa perlu melakukan registrasi terlebih dahulu.
          Pengguna tidak dapat melihat data nasabah, histori aktivitas, dan
          status laporan.
        </Typography>
        <br></br>
        <Typography fontWeight={700} fontSize={14}>
          C. KETENTUAN DAN PENGGUNAAN APLIKASI
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          1. Pengguna wajib memastikan nomor kartu Indonesia Sehat (KIS) BPJS
          Kesehatan/Kartu Tanda Penduduk milik Pengguna yang di-input oleh
          Pengguna pada Aplikasi dalam proses registrasi adalah milik Pengguna
          sendiri.
        </Typography>
        <Typography fontSize={12}>
          2. Pengguna Terdaftar wajib menjaga kerahasiaan Password Aplikasi
        </Typography>
        <Typography fontSize={12}>
          3. Penggantian Password Aplikasi dapat dilakukan dengan mengakses menu
          Akun Saya
        </Typography>
        <Typography fontSize={12}>
          4. Pengguna wajib memastikan kebenaran data yang di-input oleh
          Pengguna di Aplikasi pada saat melakukan registrasi dan menggunakan
          Aplikasi. Pengguna bertanggung jawab atas segala akibat yang timbul
          atas setiap pengisian data yang dilakukan oleh Pengguna pada saat
          melakukan registrasi, update data pada Aplikasi, dan/atau menggunakan
          Aplikasi. Pengguna dengan ini membebaskan BPJS Kesehatan dari segala
          macam tuntutan, gugatan, dan/atau tindakan hukum lainnya dari pihak
          manapun sehubungan dengan kesalahan, kekeliruan, dan/atau
          ketidakbenaran data yang di-input oleh Pengguna pada Aplikasi, kecuali
          hal tersebut disebabkan karena kesalahan atau kelalaian BPJS
          Kesehatahan.
        </Typography>
        <Typography fontSize={12}>
          5. Penggunaan Care Center 165 Call oleh Pengguna dapat dilakukan
          dengan memilih menu Care Center 165 Call
        </Typography>
        <Typography fontSize={12}>
          6. Penggunaan Care Center 165 Chat dapat dilakukan dengan memilih
          akses chat melalui aplikasi chatting Mobile Care Center 165 atau
          aplikasi chatting yang disediakan oleh pihak yang bekerja sama dengan
          BPJS Kesehatan:
        </Typography>
        <Typography fontSize={12} marginLeft={2}>
          a. Dalam hal Pengguna menggunakan Care Center 165 Chat melalui
          aplikasi chatting Care Center 165, Pengguna harus terlebih dahulu
          memasukkan data yang diperlukan seperti nama, NIK, alamat e-mail, dan
          nomor telepon milik Pengguna pada widget aplikasi chatting Care Center
          165. Pengguna tidak diperkenankan untuk memasukkan data milik pihak
          lain pada widget aplikasi chatting Care Center 165. Pengguna
          bertanggung jawab sepenuhnya atas segala akibat yang timbul karena
          dimasukkannya nama, alamat e-mail, dan nomor telepon milik pihak lain
          dalam menggunakan Care Center 165 Chat
        </Typography>
        <Typography fontSize={12} marginLeft={2}>
          b. Apabila Pengguna mengakses Care Center 165 Chat melalui aplikasi
          chatting yang disediakan oleh pihak yang bekerja sama dengan BPJS
          Kesehatan, maka Pengguna wajib terlebih dahulu mengunduh aplikasi
          chatting yang disediakan oleh pihak yang bekerja sama dengan BPJS
          Kesehatan tersebut dari toko aplikasi seperti App Store atau Play
          Store
        </Typography>
        <Typography fontSize={12}>
          7. Penggunaan Care Center 165 Mail dapat dilakukan oleh Pengguna dan
          e-mail dari Pengguna akan ditujukan secara otomatis ke
          carecenter@bpjs-kesehatan.go.id.
        </Typography>
        <Typography fontSize={12}>
          8. Penggunaan Care Center 165 Social Media (Twitter) dapat dilakukan
          oleh Pengguna dan pesan dari Pengguna akan ditujukan secara otomatis
          ke media sosial (Twitter) BPJS Kesehatan
        </Typography>
        <Typography fontSize={12}>
          9. Pengguna dapat melakukan pengkinian data secara self-service dengan
          memilih menu Pengkinian Data pada Aplikasi dan mengakses webview
          pengkinian data secara self-service yang disediakan oleh BPJS
          Kesehatan yang terhubung pada Pelaksanaan pengkinian data tersebut
          tunduk pada ketentuan yang berlaku di BPJS Kesehatan erkait dengan
          pengkinian data nasabah secara self-service.
        </Typography>
        <Typography fontSize={12}>
          10. Data terkait Aplikasi akan disimpan oleh BPJS Kesehatan sesuai
          ketentuan retensi yang berlaku
        </Typography>
        <Typography fontSize={12}>
          11. Pengguna wajib melakukan peningkatan versi (upgrade) Aplikasi atas
          permintaan BPJS Kesehatan
        </Typography>
        <Typography fontSize={12}>
          12. Kelalaian Pengguna dalam melakukan peningkatan versi (upgrade)
          Aplikasi mengakibatkan Pengguna tidak dapat menggunakan Aplikasi atau
          hanya dapat mengakses fitur tertentu di Aplikasi
        </Typography>
        <Typography fontSize={12}>
          13. Apabila Pengguna Terdaftar lupa Password Aplikasi, Pengguna
          Terdaftar tidak dapat melakukan reset Password Aplikasi pada Aplikasi.
          Untuk dapat kembali menggunakan Aplikasi, Pengguna Terdaftar harus
          terlebih dahulu melakukan penghapusan data Pengguna Terdaftar pada
          Aplikasi dan melakukan registrasi ulang pada Aplikasi.
        </Typography>
        <Typography fontSize={12}>
          14. Apabila Pengguna Terdaftar salah memasukkan Password Aplikasi
          sebanyak 3 (tiga) kali secara berturut-turut maka akun Pengguna
          Terdaftar pada aplikasi akan terblokir dan tidak dapat digunakan
          kembali. Pengguna Terdaftar dapat membuat akun baru dengan melakukan
          registrasi ulang pada Aplikasi.
        </Typography>
        <Typography fontSize={12}>
          15. Pengguna bertanggung jawab sepenuhnya dan membebaskan BPJS
          Kesehatan dari segala akibat yang timbul sehubungan dengan kelalaian
          Pengguna dalam menggunakan Aplikasi
        </Typography>
        <Typography fontSize={12}>
          16. Pengguna wajib merahasiakan dan memastikan keamanan Password
          Aplikasi dan OTP yang diterima oleh Pengguna dalam menggunakan
          Aplikasi serta tidak memberitahukan Password Aplikasi dan/atau OTP
          tersebut kepada pihak lain Segala penyalahgunaan Password Aplikasi
          dan/atau OTP yang disebabkan karena kesalahan atau kelalaian Pengguna
          dalam menjaga kerahasiaan dan keamanan Password Aplikasi dan/atau OTP
          tersebut merupakan tanggung jawab Pengguna sepenuhnya. Pengguna dengan
          ini membebaskan BPJS Kesehatan dari segala tuntutan, gugatan, dan/atau
          tindakan hukum lainnya dalam bentuk apa pun yang timbul dari pihak
          manapun termasuk Pengguna sendiri sebagai akibat penyalahgunaan
          Password Aplikasi dan/atau OTP milik Pengguna yang disebabkan oleh
          kesalahan atau kelalaian Pengguna dalam menjaga kerahasiaan dan
          keamanan Password Aplikasi dan/atau OTP tersebut.
        </Typography>
        <br></br>
        <Typography fontWeight={700} fontSize={14}>
          D. FORCE MAJURE
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          Dalam hal BPJS Kesehatan tidak dapat melaksanakan instruksi dari
          Pengguna, baik sebagian maupun seluruhnya karena kejadian-kejadian
          atau hal-hal di luar kekuasaan atau kemampuan BPJS Kesehatan, termasuk
          namun tidak terbatas pada bencana alam, perang, huru-hara,
          peralatan/sistem/transmisi dalam keadaan tidak berfungsi, terjadinya
          gangguan listrik, gangguan telekomunikasi, adanya kebijakan pemerintah
          atau otoritas pengawas perbankan yang melarang BPJS Kesehatan
          menyediakan Aplikasi, serta kejadian-kejadian atau hal-hal lain di
          luar kekuasaan atau kemampuan BPJS Kesehatan, maka Pengguna dengan ini
          membebaskan BPJS Kesehatan dari segala macam tuntutan, gugatan,
          dan/atau tindakan hukum lainnya dalam bentuk apa pun terkait dengan
          hal tersebut.
        </Typography>
        <br></br>
        <Typography fontWeight={700} fontSize={14}>
          E. PENANGANAN KELUHAN (PENGADUAN)
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          1. Keluhan/pengaduan terkait Aplikasi dapat disampaikan oleh Pengguna
          melalui kantor cabang BPJS Kesehatan terdekat dan/atau dengan
          menghubungi Care Center 165. Untuk keperluan penanganan
          keluhan/pengaduan tersebut, BPJS Kesehatan berhak meminta Pengguna
          untuk menyerahkan fotokopi identitas diri Pengguna dan/atau dokumen
          pendukung lainnya sesuai ketentuan yang berlaku di BPJS Kesehatan.
        </Typography>
        <Typography fontSize={12}>
          2. BPJS Kesehatan akan menanggapi keluhan/pengaduan yang disampaikan
          oleh Pengguna sebagaimana dimaksud dalam butir E.1 di atas sesuai
          dengan ketentuan hukum yang berlaku.
        </Typography>
        <Typography fontSize={12}>
          3. Keluhan/pengaduan terkait Aplikasi harus disampaikan oleh Pengguna
          kepada BPJS Kesehatan selambat-lambatnya 3 (tiga) bulan sejak tanggal
          terjadinya Transaksi.
        </Typography>
        <Typography fontSize={12}>
          4. Pengguna setuju bahwa setiap perselisihan atau perbedaan pendapat
          yang timbul dari dan/atau berkenaan dengan pelaksanaan Ketentuan
          Aplikasi Mobile Care Center 165 BPJS Kesehatan ini akan diselesaikan
          dengan cara musyawarah untuk mencapai mufakat
        </Typography>
        <Typography fontSize={12}>
          5. Setiap perselisihan atau perbedaan pendapat yang tidak dapat
          diselesaikan secara musyawarah oleh BPJS Kesehatan dan Pengguna akan
          diselesaikan melalui fasilitasi Lembaga Pemerintah yang berwenang
          dalam penyelenggaraan layanan public.{" "}
        </Typography>
        <Typography fontSize={12}>
          6. Setiap perselisihan atau perbedaan pendapat yang tidak dapat
          diselesaikan baik secara musyawarah, fasilitasi Lembaga Pemerintah
          yang berwenang dalam penyelenggaraan layanan public, dan/atau mediasi
          sebagaimana dimaksud dalam butir E.5 di atas akan diselesaikan melalui
          Pengadilan Negeri Jakarta Pusat, dengan tidak mengurangi hak BPJS
          Kesehatan untuk mengajukan gugatan atau tuntutan melalui Pengadilan
          Negeri lainnya dalam wilayah Republik Indonesia
        </Typography>
        <br></br>
        <Typography fontWeight={700} fontSize={14}>
          F. LAIN-LAIN
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          Dengan menjadi Pengguna Aplikasi, Pengguna dengan ini menyatakan telah
          memahami sepenuhnya serta tunduk dan terikat pada isi Ketentuan
          Aplikasi Mobile Care Center 165 BPJS Kesehatan ini. BPJS Kesehatan
          berhak untuk mengubah, melengkapi, atau mengganti Ketentuan Aplikasi
          Mobile Care Center 165 BPJS Kesehatan ini yang akan diberitahukan oleh
          BPJS Kesehatan kepada Pengguna dalam bentuk dan melalui sarana apa pun
          sesuai ketentuan hukum yang berlaku.
        </Typography>
        <br></br>
        <Typography fontSize={12}>
          Ketentuan Aplikasi Mobile Care Center 165 BPJS Kesehatan (“Care Center
          165”) ini telah disesuaikan dengan ketentuan peraturan
          perundang-undangan termasuk peraturan BPJS Kesehatan yang berlaku.
        </Typography>
        <br></br>
        <a
          style={{ textDecoration: "none", fontSize: 14, paddingBottom: 20 }}
          href="https://www.bpjs-kesehatan.co.id/id/Syarat-dan-Ketentuan/aplikasi-mobile-carecenter165"
        >
          https://www.bpjs-kesehatan.co.id/id/Syarat-dan-Ketentuan/aplikasi-mobile-carecenter165
        </a>
        <br></br>
      </Box>
    </Dialog>
  );
};

export default TermsCond;
