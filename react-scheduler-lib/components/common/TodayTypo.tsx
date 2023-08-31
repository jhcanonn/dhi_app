import { Tooltip, Typography } from "@mui/material";
import { format, isToday } from "date-fns";

// DHI-CODE - Tooltip component, Only one Typography

interface TodayTypoProps {
  date: Date;
  onClick?(day: Date): void;
  locale: Locale;
  tootip?: JSX.Element | null;
}

const TodayTypo = ({ date, onClick, locale, tootip }: TodayTypoProps) => {
  return (
    <Tooltip title={tootip} placement="bottom">
      <Typography
        style={{
          fontWeight: isToday(date) ? "bold" : "inherit",
        }}
        color={isToday(date) ? "primary" : "inherit"}
        className={onClick ? "rs__hover__op" : ""}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(date);
        }}
      >
        <span style={{padding: '2px 5px', display: 'inline-block', boxSizing: 'border-box', width: '100%'}}>
          {format(date, "dd", { locale })} <span style={{fontSize: 11}}>- {format(date, "eee", { locale })}</span>
        </span>
      </Typography>
    </Tooltip>
  );
};

export default TodayTypo;
