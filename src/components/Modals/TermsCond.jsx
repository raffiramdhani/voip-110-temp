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
          <Typography fontWeight={700}>Syarat & Ketentuan</Typography>
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
        <br></br>
        <Typography fontSize={12}>
          1.Dengan menggunakan layanan Click to Dial ini, maka anda telah
          menyetujui bahwa percakapan anda kami rekam.
        </Typography>
        <Typography fontSize={12}>
          2.Petugas berhak untuk mengakhiri percakapan lebih awal jika dalam
          interaksi terdapat unsur SARA, Seksual, dan perbuatan tidak
          menyenangkan.
        </Typography>
      </Box>
    </Dialog>
  );
};

export default TermsCond;
