// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   InputAdornment,
//   List,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { useInputValidation } from "6pp";
// import { Search as SearchIcon } from "@mui/icons-material";
// import Useritem from "../components/shared/Useritem";
// import { sampleUsers } from "../constant/Sample";
// import { useDispatch, useSelector } from "react-redux";
// import { setIsSearch } from "../redux/reducers/misc";
// import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../redux/api/api";
// import { useAsyncMutation } from "../hooks/hook";

// const Search = () => {
//   const dispatch = useDispatch();
//   const [searchUser] = useLazySearchUserQuery();
//   const [sendFriendRequest, isLoadingSendFriend] = useAsyncMutation(useSendFriendRequestMutation);

//   const addFriendHandler = async (id) => {
//     await sendFriendRequest("sending friend Request", { userId: id });
//   };

//   const { isSearch } = useSelector((state) => state.misc);

//   const searchCloseHandler = () => {
//     dispatch(setIsSearch(false));
//   };

//   const Search = useInputValidation("");

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       searchUser(Search.value)
//         .then(({ data }) => setUser(data.users))
//         .catch((e) => console.log(e));
//     }, 800);

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [Search.value]);

//   const [user, setUser] = useState([]);

//   return (
//     <Dialog
//       open={isSearch}
//       onClose={searchCloseHandler}
//       PaperProps={{
//         sx: {
//           bgcolor: '#1f1e24', // Black background
//           color: '#ffffff', // White text color
//         },
//       }}
//     >
//       <Stack spacing={4} direction="column" alignItems="center" sx={{ p: 4 }}>
//         <DialogTitle textAlign="center" sx={{ color: '#ffffff' }}>Find People</DialogTitle>
//         <TextField
//           label="Search"
//           value={Search.value}
//           onChange={Search.changeHandler}
//           variant="outlined"
//           size="small"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: '#ffffff' }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             width: '80%',
//             '& .MuiOutlinedInput-root': {
//               color: '#ffffff',
//               '& fieldset': {
//                 borderColor: '#6556cd',
//               },
//               '&:hover fieldset': {
//                 borderColor: '#4a2c8c',
//               },
//               '&.Mui-focused fieldset': {
//                 borderColor: '#6556cd',
//               },
//             },
//             '& .MuiInputLabel-root': {
//               color: '#ffffff',
//             },
//             '& .MuiInputLabel-root.Mui-focused': {
//               color: '#6556cd',
//             },
//           }}
//         />

//         <List sx={{ width: '100%', bgcolor: '#1f1e24', color: '#ffffff' }}>
//           {user.map((i) => (
//             <Useritem
//               user={i}
//               key={i._id}
//               handler={addFriendHandler}
//               handlerIsLoading={isLoadingSendFriend}
//             />
//           ))}
//         </List>
//       </Stack>
//     </Dialog>
//   );
// };

// export default Search;



import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import Useritem from "../components/shared/Useritem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../redux/reducers/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../redux/api/api";
import { useAsyncMutation } from "../hooks/hook";

const Search = () => {
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriend] = useAsyncMutation(useSendFriendRequestMutation);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("sending friend Request", { userId: id });
  };

  const { isSearch } = useSelector((state) => state.misc);

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  const Search = useInputValidation("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(Search.value)
        .then(({ data }) => setUser(data.users))
        .catch((e) => console.log(e));
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [Search.value]);

  const [user, setUser] = useState([]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
      PaperProps={{
        sx: {
          bgcolor: '#1f1e24', // Black background
          color: '#ffffff', // White text color
          borderRadius: '12px', // Rounded corners for dialog
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Subtle shadow
        },
      }}
    >
      <Stack spacing={4} direction="column" alignItems="center" sx={{ p: 4 }}>
        <DialogTitle textAlign="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Find People
        </DialogTitle>
        <TextField
          label="Search"
          value={Search.value}
          onChange={Search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#ffffff' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '80%',
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              borderRadius: '20px', // Rounded input corners
              '& fieldset': {
                borderColor: '#6556cd',
              },
              '&:hover fieldset': {
                borderColor: '#4a2c8c',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6556cd',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#6556cd',
            },
          }}
        />

        <List sx={{ width: '100%', bgcolor: '#1f1e24', color: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          {user.map((i) => (
            <Useritem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriend}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
