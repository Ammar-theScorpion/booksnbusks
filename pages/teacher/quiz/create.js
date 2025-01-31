import TeacherLayout from "../../../layouts/teacher";
import {DatePicker, Form, Popconfirm, Select} from "antd";
import FormInput from "../../../components/form/FormInput";
import {Col, Row} from "react-bootstrap";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchClasses, postQuiz} from "../../../helpers/backend_helper";
import CardSelector from "../../../components/form/CardSelector";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import DateTime from "../../../components/form/DateTime";
import moment from "moment";
import {FiArrowLeft} from "react-icons/fi";
import Button from "../../../components/form/Button";

const { Option } = Select;

const CreateQuiz = () => {

    const router = useRouter()
    const [form] = Form.useForm()
    const [classes] = useFetch(fetchClasses, {nameOnly: true, mine: true})
    const [changed, setChanged] = useState(false)
    const [sumErrorMessage, setSumErrorMessage] = useState(null);
    const [awardPoints, setAwardPoints] = useState(10);

    //predetermined value (at the moment quizzes are worth 10 points)
    //const awardPoints = 10;

    const validateSumOfPoints = (values) => {
        const sumOfPoints = values?.questions?.reduce((sum, question) => sum + (+question.points), 0);
        if (sumOfPoints !== awardPoints) {
            setSumErrorMessage(`Sum of question points should equal ${awardPoints}`);
            return false;
        } else 
        setSumErrorMessage(null);
        return true;
    };

    const onFinish = (values) => {
        if (!validateSumOfPoints(values)) return; // Check sum of question points

        values?.questions?.forEach((question) => {
            question.points = +question.points;
            question.min = +question.min || 0;
            question.max = +question.max || 0;
            question.options = question.type === 'single' || question.type === 'multiple' ? question.options : [];
        });

        // Add the predefined awardPoints to values before submitting
        values.points = awardPoints;

        return useAction(postQuiz, values, () => {
            router.push('/teacher/quiz');
        });
    };


    return (
    <>
    <div>
        <h4 className="page-title"> <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Create Quiz</h4>
    </div>
    <hr className="bg-C4"/>
        <Form layout="vertical" form={form} onFinish={onFinish}> 
        <Row>
        <Col md={6}>
        <FormInput name="title" 
                   label="Quiz Title" 
                   placeholder="Enter quiz name (i.e. ITP 348 Intro to Web Development)" 
                   required/>
        <Form.Item name={'submission_start'} 
                   label="Submission Start" 
                   initialValue={moment().startOf('day')} 
                   rules={[{required: true, message: 'Please provide Submission Date.'}]}>
                   <DateTime/>
        </Form.Item>
        <Form.Item name="points" label="Award Points" type="number" initialValue={awardPoints} rules={[() => ({
            validator(_, value) {
                if (value == awardPoints) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error(`All quizzes are worth ${awardPoints} points`));
            },
        })
        ]} required>
            <Select
                defaultValue={awardPoints.toString()} // Set the default value
                onChange={(value) => setAwardPoints(parseInt(value))} // Update the selected points
                // Disable manual input
              >
                <Option value="5">5</Option>
                <Option value="10">10</Option>
            </Select>

        </Form.Item>
        </Col>
        <Col md={6}>
            <FormInput name="course" label="Course Number" placeholder="Enter section"/>
            <Form.Item name={'submission_end'} label="Submission End" initialValue={moment().endOf('day')}
            rules={[{required: true, message: 'Please provide submission date.'},
            ({getFieldValue}) => ({
                validator(_, value) {
                    if (getFieldValue('submission_start').isBefore(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Submission End must be after Submission Start'));
                },
            })]}>
                <DateTime/>
                </Form.Item>
                </Col>
                <Col md={12}>
                <CardSelector name="classes" label="Class"
                    options={classes}
                    required/>
                <p className="mt-2 text-base font-semibold">Questions</p>
                <div className="p-4 bg-F8 rounded">
                    <Form.List name="questions">
                        {(fields, {add, remove}) => (
                        <>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Question key={key} name={name} fieldKey={fieldKey}
                            onRemove={() => remove(name)} restField={restField} form={form}
                            setChanged={setChanged}/>
                        ))}
                    <Button onClick={() => add()}>Add Question</Button>
                </>
                )}
                </Form.List>
                </div>
                </Col>
            </Row>
            {sumErrorMessage && <div className="alert alert-danger">{sumErrorMessage}</div>}
            <Form.Item>
                <Button htmlType="submit"> Add Quiz</Button>
            </Form.Item>
            </Form>
                </>
            );
        };
CreateQuiz.layout = TeacherLayout
export default CreateQuiz

  

export const Question = ({name, fieldKey, onRemove, restField, form, setChanged}) => {
    const [type, setType] = useState('single')
    const [answer, setAnswer] = useState(-1 | [])

    const handlePointsChange = (e) => {
        const value = e.target.value;
        form.setFieldsValue({
            questions: form.getFieldValue('questions').map((question, idx) => {
            if (idx === name) {
                return { ...question, points: value };
            }
            return question;
            }),
        });
        console.log("value from handlePointsChange", value); // Log the value to debug
    };

    const handleAnswerChange = value => {
        setChanged(true)
        if (type === 'single') {
            setAnswer(value)
            let questions = form.getFieldValue('questions');
            questions[name].answer = value
            form.setFieldsValue({questions})
        } else {
            let selected = Array.isArray(answer) ? answer : []
            let find = selected.findIndex(answer => answer === value)
            if (find >= 0) {
                selected.splice(find, 1)
            } else {
                selected.push(value)
            }
            setAnswer(selected)
            let questions = form.getFieldValue('questions');
            questions[name].answer = selected
            form.setFieldsValue({questions})
        }
    }

    useEffect(() => {
        let questions = form.getFieldValue('questions');
        setType(questions[name].type)
        setAnswer(questions[name].answer)
    })

    return (
        <div className="position-relative">
            <h5> Enter Question Details</h5>
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={onRemove}>
                <span role="button"
                className="position-absolute text-danger" style={{right: 10, top: 0}}>Remove</span>
            </Popconfirm>
            <div className="row mb-4">
                <div className="col-md-6">
                    <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        fieldKey={[fieldKey, 'title']}
                        className="mb-3"
                        initialValue=""
                        rules={[{required: true, message: 'Please provide question title'}]}>
                            <input className="form-control" placeholder="Title"/>
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        initialValue="single"
                        name={[name, 'type']}
                        className="mb-3"
                        fieldKey={[fieldKey, 'type']}
                        rules={[{required: true, message: 'Please provide question type'}]}>
                <select
                    className="form-control"
                    placeholder="Type"
                    onChange={e => setType(e.target.value)}
                >
                <option value="single">Multiple Choice</option>
                <option value="multiple">Select Multiple</option>
                {/*<option value="paragraph">Paragraph</option>
                <option value="short_answer">Short Answer</option>*/}
                </select>
                </Form.Item>
                <Form.Item
                {...restField}
                className="mb-3"
                name={[name, 'points']}
                fieldKey={[fieldKey, 'points']}
                initialValue={0}
                rules={[
                    {required: true, message: 'Please provide question points'}]}
                >
                

                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Points" 
                    onChange={handlePointsChange}
                    onWheel={(e) => {
                        e.currentTarget.blur(); // Remove focus from the input to prevent scrolling
                        e.preventDefault();
                    }}
                    onFocus={(e) => e.currentTarget.select()} // Select the text on focus for easy typing
                    style={{ pointerEvents: 'auto' }} // Enable pointer events
                />
                
    </Form.Item>

                </div>
                {type === 'paragraph' && (
                    <div className="col-md-6">
                        <Form.Item
                            {...restField}
                            className="mb-3"
                            name={[name, 'min']}
                            fieldKey={[fieldKey, 'min']}
                            initialValue=""
                            rules={[{required: true, message: 'Please provide min words'}]}>
                        <input type="number" className="form-control" placeholder="Min Words"/>
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            className="mb-3"
                            name={[name, 'max']}
                            fieldKey={[fieldKey, 'max']}
                            initialValue=""
                            rules={[{required: true, message: 'Please provide max words'}]}>
                                <input type="number" className="form-control" placeholder="Max Words"/>
                                </Form.Item>
                        </div>
                    )}
                    {(type === 'single' || type === 'multiple') && (
                    <div className="col-md-6">
                        <Form.List
                        {...restField}
                        name={[name, 'options']}
                        initialValue={['', '', '', '']}
                        fieldKey={[fieldKey, 'options']}>
                            {(fields, {add, remove}, {errors}) => (
                            <>
                            {fields.map((field, index) => (
                            <Form.Item
                                required={false}
                                key={field.key}
                                className="position-relative"
                                >
                                    <Form.Item
                                    {...field}
                                    initialValue=""
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {required: true, 
                                            whitespace: true,
                                            message: "Please provide an option or delete this field.",
                                        },
                                    ]}
                                    noStyle
                                    >
                            <input placeholder={'Option ' + (index + 1)} className="form-control mb-2"
                            style={{paddingLeft: 30, paddingRight: 30}}/>
                            </Form.Item>
                            <span role="button" onClick={() => remove(index)}
                            className="position-absolute" style={{right: 10, top: 6}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                fill="currentColor"
                                className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                        </span>
                    {type === 'single' ? (
                        <input type="radio" name={'answer' + name} role="button" className="position-absolute" rules={[{required: true,
                                                                                 message: "Please provide an option or delete this field."}]} 
                                                                                 onChange={() => handleAnswerChange(index)}
                                                                                 style={{left: 10, top: 12}} checked={answer === index}/>
                    ) : (
                        <input type="checkbox" onChange={() => handleAnswerChange(index)} className="position-absolute" 
                                                                                          style={{left: 10, top: 12}}
                                                                                          checked={Array.isArray(answer) && answer?.includes(index)}/>
                    )}
                    </Form.Item>
                    ))}
                    <button type="button" className="rounded btn-primary mx-auto mt-2"
                    onClick={() => add()}>Add Option</button>
                    <Form.ErrorList errors={errors}/>
                    </>
                )}
            </Form.List>
        </div>)}
    </div>
</div>
)}