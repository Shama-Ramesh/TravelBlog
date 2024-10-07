import React, { useState } from 'react';
import { Box, Paper, Grid, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';


export default function AddCourse() {
    const host = "http://127.0.0.1:5000";
    const [courseDetails, setCourseDetails] = useState({});
    const [fields, setFields] = useState([{ roadmap: '' }]);
    const [chapters, setChapters] = useState([{ title: '', content: '', description: '' }]);
    const [image, setImage] = useState('');
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCourseDetails = (e) => {
        setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
        setErrors((prev) => ({
            ...prev,
            [e.target.name]: ""
        }));
    }

    const handleAddField = () => {
        setFields([...fields, { roadmap: '' }]);
    };

    const handleRemoveField = (index) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    const handleChange = (index, event) => {
        const values = [...fields];
        values[index][event.target.name] = event.target.value;
        setFields(values);
    };

    const handleAddChapter = () => {
        setChapters([...chapters, { title: '', content: '', description: '' }]);
    };

    const handleRemoveChapter = (index) => {
        const values = [...chapters];
        values.splice(index, 1);
        setChapters(values);
    };

    const handleChangeChapter = (index, event) => {
        const values = [...chapters];
        values[index][event.target.name] = event.target.value;
        setChapters(values);
        setErrors((prev) => ({
            ...prev,
            [`chapter_${index}_${event.target.name}`]: ""
        }));
    };

    const handleImage = (e) => {
        setImage({ ...image, [e.target.name]: e.target.files[0] });
        setErrors((prev) => ({
            ...prev,
            [e.target.name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!courseDetails.title) {
            newErrors.title = 'Title is required';
            isValid = false;
        }
        if (!courseDetails.category) {
            newErrors.category = 'Category is required';
            isValid = false;
        }
        if (!courseDetails.level) {
            newErrors.level = 'Level is required';
            isValid = false;
        }
        if (!image.thumbnail) {
            newErrors.thumbnail = 'Thumbnail is required';
            isValid = false;
        }
        if (!courseDetails.description) {
            newErrors.description = 'Description is required';
            isValid = false;
        }
        fields.forEach((field, index) => {
            if (!field.roadmap) {
                newErrors[`roadmap_${index}`] = 'Roadmap is required';
                isValid = false;
            }
        });
        chapters.forEach((chapter, index) => {
            if (!chapter.title) {
                newErrors[`chapter_${index}_title`] = 'Title is required';
                isValid = false;
            }
            if (!chapter.content) {
                newErrors[`chapter_${index}_content`] = 'Content is required';
                isValid = false;
            }
            if (!chapter.description) {
                newErrors[`chapter_${index}_description`] = 'Description is required';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const Data = new FormData();
        Data.append('title', courseDetails.title);
        Data.append('category', courseDetails.category);
        Data.append('level', courseDetails.level);
        Data.append('thumbnail', image.thumbnail);
        Data.append('description', courseDetails.description);
        Data.append('roadmap', JSON.stringify(fields));
        Data.append('chapters', JSON.stringify(chapters));

        axios.post(`${host}/api/admin/insertcourse`, Data)
            .then((res) => {
                if (res.data) {
                    setOpen(true);
                } else {
                    console.log("some error occured");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div style={{ height: '100%' }}>
            <Paper>
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Course Details</p>
                   <Link to='/admin/manage-course'><Button size='small' endIcon={<ArrowForwardIosIcon />}>View Course</Button></Link>
                </Box>

                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="outlined-basic"
                            label="Title"
                            name='title'
                            onChange={handleCourseDetails}
                            variant="outlined"
                            size="small"
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="outlined-basic"
                            label="Category"
                            name='category'
                            onChange={handleCourseDetails}
                            variant="outlined"
                            size="small"
                            fullWidth
                            error={!!errors.category}
                            helperText={errors.category}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="outlined-basic"
                            label="Level"
                            name='level'
                            onChange={handleCourseDetails}
                            variant="outlined"
                            size="small"
                            fullWidth
                            error={!!errors.level}
                            helperText={errors.level}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type='file'
                            InputLabelProps={{ shrink: 'none' }}
                            name='thumbnail'
                            onChange={handleImage}
                            id="outlined-basic"
                            label="Upload Thumbnail"
                            variant="outlined"
                            size="small"
                            fullWidth
                            error={!!errors.thumbnail}
                            helperText={errors.thumbnail}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            label="Description"
                            name='description'
                            onChange={handleCourseDetails}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Grid>

                    {fields.map((field, index) => (
                        <Grid item xs={12} md={8} key={index}>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <TextField
                                    id="outlined-basic"
                                    label={`Roadmap ${index + 1}`}
                                    variant="outlined"
                                    size="small"
                                    name="roadmap"
                                    value={field.roadmap}
                                    onChange={event => handleChange(index, event)}
                                    fullWidth
                                    error={!!errors[`roadmap_${index}`]}
                                    helperText={errors[`roadmap_${index}`]}
                                />
                                {index > 0 && (
                                    <IconButton
                                        aria-label="remove"
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleRemoveField(index)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>
                    ))}
                    <Grid item xs={12} md={8}>
                        <Button aria-label="add" variant="outlined" size="small" onClick={handleAddField}>
                            <AddIcon />
                            Add Field
                        </Button>
                    </Grid>
                </Grid>


                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 3, width: '400px' }}>
                        <Button variant='contained' color='primary' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Course Inserted!
                </Alert>
            </Snackbar>
        </div>
    );
}


