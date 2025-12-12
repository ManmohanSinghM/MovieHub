import { useState } from 'react';
import { Link } from 'react-router-dom'; // Removed 'useNavigate' since it wasn't used
import { Container, Paper, TextField, Button, Typography, Box, Alert, Grid } from '@mui/material';
import api from '../api/axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  // Removed 'const navigate = useNavigate();' because you use window.location.href instead

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Register Request
      const response = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
        role: 'user' 
      });

      // 2. Auto Login (Save token)
      localStorage.setItem('token', response.data.token);
      
      // 3. Redirect to Home (Force refresh to update AuthContext)
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal" required fullWidth label="Username" name="username"
              autoFocus onChange={handleChange}
            />
            <TextField
              margin="normal" required fullWidth label="Password" name="password"
              type="password" onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, height: 48 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
