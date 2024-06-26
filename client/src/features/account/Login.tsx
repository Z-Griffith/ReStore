import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';

// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Login() {

    // const [values, setValues] = useState({
    //     username: '',
    //     password: ''
    // })
    
    // const handleSubmit = (event: any) =>{
    //     event.preventDefault(); // Prevent default behaviour
    //     agent.Account.login(values);
    // };

    // function handelInputChange(event:any){
    //     const {name, value} = event.target;
    //     setValues({...values, [name]: value});
    // }

    // // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // // event.preventDefault();
    // // const data = new FormData(event.currentTarget);
    // // console.log({
    // //   email: data.get('email'),
    // //   password: data.get('password'),
    // // });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
    mode: 'onTouched'
  })

  async function submitForm(data: FieldValues) {
   await dispatch(signInUser(data));
   navigate('/catalog');
   
    // try {
    //   await agent.Account.login(data);
    // } catch (error) {
    //   console.log(error);
    // }
   
  }

  return (
    // <ThemeProvider theme={defaultTheme}>
      <Container component={Paper} maxWidth="sm" 
      sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
        {/* <CssBaseline /> */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
            //   required
              fullWidth
              label="Username"
            // name="username"
            // autoComplete="username"
              autoFocus
              {...register('username', {
                required: 'Username is required'
              })}
              error={!!errors.username} // cast our username into a boolean  
              helperText={errors?.username?.message as string}
            // onChange={handelInputChange}
            // value={values.username}
            />
            <TextField
              margin="normal"
            //   required
              fullWidth
            // name="password"
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required'
              })}
              error={!!errors.password} // cast our username into a boolean  
              helperText={errors?.password?.message as string}
            // autoComplete="current-password"
            // onChange={handelInputChange}
            // value={values.password}
            />
            <LoadingButton loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to='/register'  style={{ textDecoration: 'none'}}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
    // </ThemeProvider>
  );
}