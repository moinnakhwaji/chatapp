
import { keyframes, Skeleton, styled } from "@mui/material"
import { Link as LinkComponent } from "react-router-dom";
import { grey } from "../../constant/Color";

 export const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
});
export const StyledLink = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

 export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
   background-color: ${grey};
`;

 export const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
    background-color: ${grey};
  font-size: 1.1rem;
`;

 export const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  cursor: pointer;
   background-color: ${grey};
  color: white;
  font-size: 1.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
export const bounceAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

// Bouncing Skeleton with animation
export const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
  backgroundColor: '#6556cd', // Adding the preferred icon color
}));

