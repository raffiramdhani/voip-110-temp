import {
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Setting = ({
  open,
  onClose,
  mics,
  mic,
  speakers,
  speaker,
  setMic,
  setSpeaker,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "0.95rem" }}>
        <div>
          <Typography fontWeight={700}>Settings</Typography>
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
        sx={{
          backgroundColor: "#f4f4f4",
          height: "400px",
          width: 300,
          padding: "20px",
        }}
      >
        <Typography marginTop={1}>Speaker</Typography>

        <Select
          placeholder={"Select speaker"}
          size="small"
          onChange={(event) => setSpeaker(event)}
          label={"Speaker"}
          sx={{ width: "100%" }}
          value={speaker}
        >
          {speakers?.length > 0 &&
            speakers.map((e) => {
              return <MenuItem value={e.id}>{e.label}</MenuItem>;
            })}
        </Select>
        {/* <Typography marginTop={1}>Mic</Typography>

        <Select
          value={mic}
          placeholder={"Select mic"}
          size="small"
          onChange={(event) => setMic(event)}
          label={"Mic"}
          sx={{ width: "100%" }}
        >
          {mics?.length > 0 &&
            mics.map((e) => {
              return <MenuItem value={e.id}>{e.label}</MenuItem>;
            })}
        </Select> */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: `${color.main}`,
            color: "white",
            border: "none",
            "&:focus": { bgcolor: `${color.main}` },
            marginTop: 1,
          }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};

export default Setting;
