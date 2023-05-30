import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store/index';

interface replayState {
  camname: string;
  temp: string;
  token: string;
  videoOne: string;
  videoTwo: string;
  videoThree: string;
  videoFour: string;
  startTime:string;
  Adswitch:Boolean;
}

const initialState: replayState = {
  camname: '',
  temp: '',
  token: '',
  videoOne:'',
  videoTwo:'',
  videoThree:'',
  videoFour:'',
  startTime:'',
  Adswitch:false,
};

export const ReSlice = createSlice({
  name: 'replay',
  initialState,
  reducers:{
    changeName:(state,action:PayloadAction<string>) => {
        state.camname = action.payload;
    },
    changeTemp:(state,action:PayloadAction<string>) => {
        state.temp = action.payload;
        console.log('====================================');
        console.log(state);
        console.log('====================================');
    },
    changeToken:(state,action:PayloadAction<string>) => {
      state.token = action.payload;
      console.log('====================================');
      console.log(state);
      console.log('====================================');
    },
    changeVideoOne:(state,action:PayloadAction<string>) => {
      state.videoOne = action.payload;
    },
    changeVideoTwo:(state,action:PayloadAction<string>) => {
      state.videoTwo = action.payload;
    },
    changeVideoThree:(state,action:PayloadAction<string>) => {
      state.videoThree = action.payload;
    },
    changeVideoFour:(state,action:PayloadAction<string>) => {
      state.videoFour = action.payload;
    },
    changeAdswitch:(state,action:PayloadAction<boolean>) => {
      state.Adswitch = action.payload;
    },
    // changereplaytime:(state,action:PayloadAction<string>) => {
    //   state.startTime = action.payload;
    // }
  }
});


//将action暴露出去
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const {changeName,changeTemp,changeToken,changeVideoOne,changeVideoTwo,changeVideoThree,changeVideoFour,changeAdswitch} = ReSlice.actions;
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

//使用thunk达成异步
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;




export const selectName = (state: RootState) =>state.replay.camname
export const selectTemp = (state: RootState) =>state.replay.temp
export const selectToken = (state: RootState) =>state.replay.token
export const selectVideoOne = (state: RootState) =>state.replay.videoOne
export const selectVideoTwo = (state: RootState) =>state.replay.videoTwo
export const selectVideoThree = (state: RootState) =>state.replay.videoThree
export const selectVideoFour = (state: RootState) =>state.replay.videoFour
export const selectAdswitch = (state: RootState) =>state.replay.Adswitch
// export const selectStartTime = (state: RootState) =>state.replay.startTime
export default ReSlice.reducer;