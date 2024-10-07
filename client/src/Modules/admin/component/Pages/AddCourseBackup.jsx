import React, { useState } from 'react';
import { Box, Paper, Grid, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function AddCourse() {
    const host = "http://127.0.0.1:5000";
    const [course, setCourse] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [fields, setFields] = useState([{ roadmap: '' }]);
    const [chapters, setChapters] = useState([{ title: '', content: '', description: '' }]);
    const [image, setImage] = useState('');
    const [open, setOpen] = useState(false);

    

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
  
        setOpen(false);
    };




    const handleCourseDetails = (e) => {
        setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
    }

    console.log(courseDetails, 'coueseDetails')


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

    console.log(fields, 9090)

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
        // if (event.target.name == 'content') {
        //     values[index][event.target.name] = event.target.files[0];
        // } else {
            values[index][event.target.name] = event.target.value;
        // }
        setChapters(values);
    };
    console.log(chapters)



    const handleImage = (e) => {
        // setImgError(false);
        setImage({ ...image, [e.target.name]: e.target.files[0] });
    };



    console.log(chapters, 98)

    const handleSubmit = () => {

        const Data = new FormData();
        Data.append('title', courseDetails.title);
        Data.append('category', courseDetails.category);
        Data.append('level', courseDetails.level);
        Data.append('thumbnail', image.thumbnail);
        Data.append('description', courseDetails.description);
        // fields.forEach((field, index) => {
        //     Data.append('roadmap', field.roadmap);
        // });
        Data.append('roadmap', JSON.stringify(fields));
        Data.append('chapters', JSON.stringify(chapters));
        // 
        // chapters.map((chapter, index) => {
        //     Data.append(`content`, chapter.content);
        // });

        axios.post(`${host}/api/admin/insertcourse`, Data)
            .then((res) => {
                if (res.data) {
                    console.log(res.data)
                    setOpen(true);
                } else {
                    console.log("some error occured")
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }

    return (
        <div style={{ height: '100%' }}>
            <Paper>
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Course Details</p>
                </Box>

                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" label="Title" name='title' onChange={handleCourseDetails} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" label="Category" name='category' onChange={handleCourseDetails} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" label="Level" name='level' onChange={handleCourseDetails} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField type='file' InputLabelProps={{ shrink: 'none' }} name='thumbnail' onChange={handleImage} id="outlined-basic" label="Upload Thumbnail" variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" label="Description" name='description' onChange={handleCourseDetails} variant="outlined" size="small" multiline rows={2} fullWidth />
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
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Chapter Details</p>
                </Box>

                


                <Box sx={{ p: 2 }}>
                    {chapters.map((chapter, index) => (
                        <Box >
                            <Box key={index} sx={{ backgroundColor: '#f3f3f5', mt: 2, p: 2, borderRadius: '5px' }}>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Title"
                                            variant="outlined"
                                            size="small"
                                            name="title"
                                            value={chapter.title}
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            // type="file"
                                            // InputLabelProps={{ shrink: true }}
                                            id="outlined-basic"
                                            label="Upload Content (*Link)"
                                            variant="outlined"
                                            size="small"
                                            name="content"
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Description"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            name="description"
                                            value={chapter.description}
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {index > 0 && (
                                            <IconButton
                                                aria-label="remove"
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleRemoveChapter(index)}

                                            >
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        )}
                                    </Grid>

                                </Grid>

                            </Box>


                        </Box>
                    ))}

                    <Grid item xs={12} sx={{ p: 1 }}>
                        <Button aria-label="add" variant="outlined" size="small" onClick={handleAddChapter}>
                            <AddIcon />
                            Add Chapter
                        </Button>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 3, width: '400px', }}>
                        <Button variant='contained' color='primary' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Box>
            </Paper>



            <Snackbar
                open={open}
                autoHideDuration={4000} // Set auto hide duration to 4000 milliseconds (4 seconds)
                onClose={handleClose} // Call handleClose2 when Snackbar should close
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position the Snackbar at the top right
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
