import React from "react";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import withStyles from '@material-ui/core/styles/withStyles';
import '../styles/quiz.scss';

const initialValues = {
  title: "",
  questions: [
    {
      type: "objective",
      title: "",
      choices: [{text: ""}]
    },
    {
      type: "subjective",
      title: "",
    },
  ]
}

const validationSchema = Yup.object().shape({
  
  title: Yup.string()
      .required('설문조사의 제목이 필요합니다!'),
  questions: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required(),
      title: Yup.string().required('문제의 제목이 필요합니다!'),
      choices: Yup.array().of(
        Yup.object().shape({
          text: Yup.string().required("보기에 내용을 넣어주세요!")
        })
      )

    })
  )
});

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const Survey = () => (

  <div>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2));
      }}
    >
      {({ values, handleSubmit, setValues }) => (
        <form onSubmit={handleSubmit}>
          <div className="main-container">

            <div className="title-container">
              <Field
                className="title-input"
                name="title"
                placeholder="설문조사 제목을 입력하세요"
                autocomplete="off"
              />
            </div>
            <div className="error-message">
              <ErrorMessage name="title"/>
            </div>
            <div className="questions-contanier">
              <FieldArray name="questions">
                {() => (values.questions.map((item, idx) => {

                  if (item.type === "objective") {

                    let choices = item.choices.map((choice, index) =>
                    <div key={index}>
                      <div className="obj-choice">
                        <SentimentVerySatisfiedIcon />
                        <div className="obj-choice-input">
                          <Field
                            name={`questions.${idx}.choices.${index}.text`}
                            placeholder="보기를 입력하세요"
                            autocomplete="off"
                          />
                        </div>
                        <ClearIcon
                          color="secondary"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            let delete_choice = { ...values };
                            delete_choice.questions[idx].choices.splice(index, 1);
                            setValues(delete_choice);
                          }}
                        />
                      </div>
                      <div className="error-message">
                        <ErrorMessage name={`questions.${idx}.choices.${index}.text`}/>
                      </div>
                    </div>
                    )

                    return (
                      <div key={idx} className="question-container">

                        <div className="question-header">
                          <div className="question-title">
                            <Field
                              name={`questions.${idx}.title`}
                              placeholder="객관식 제목을 입력하세요"
                              autocomplete="off"
                            />
                            <div className="error-message">
                              <ErrorMessage name={`questions.${idx}.title`}/>
                            </div>
                          </div>
              
                          <div className="select-type">
                            <InputLabel className="input-label">문제 유형</InputLabel>
                            <NativeSelect style={{ margin: "0" }}
                              onChange={(e) => {
                                const type = e.target.value;
                                const changed_type = { ...values }
                                if (type === 'subjective') {
                                  changed_type.questions[idx] = 
                                   { type: "subjective", title: "" }
                                }
                                else {
                                  changed_type.questions[idx] = 
                                    { type: "objective", title: "", choices: [{text: ""}] }
                                }
                                console.log(changed_type)
                                setValues(changed_type)
                              }}
                              input={<BootstrapInput />}
                            >
                              <option aria-label="None" value="" />
                              <option value="objective">객관식</option>
                              <option value="subjective">주관식</option>
                            </NativeSelect>
                          </div>
                          
                        </div>
                        

                        <div className="obj-choice-container">
                          {choices}
                        </div>

                        <div className="question-footer">
                          <div
                            className="add-choice-button"
                            onClick={() => {
                              let add_choice = { ...values };
                              add_choice.questions[idx].choices.push({text: ""});
                              setValues(add_choice)
                            }}
                          >
                            <AddIcon color="primary" />
                            <span>보기 추가</span>
                          </div>
                          <div className="delete-question-button"
                            onClick={() => {
                              const deleted_questions_list = { ...values }
                              deleted_questions_list.questions.splice(idx, 1)
                              setValues(deleted_questions_list)
                            }}
                          >
                            <DeleteForeverIcon color="secondary" />
                            <span>삭제하기</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  // 주관식
                  return (
                    <div key={idx} className="question-container">
                      <div className="question-header">
                        <div className="question-title">
                          <Field
                            name={`questions.${idx}.title`}
                            placeholder="주관식 제목을 입력하세요"
                            autocomplete="off"
                          />
                          <div className="error-message">
                            <ErrorMessage name={`questions.${idx}.title`}/>
                          </div>
                        </div>

                        <div className="select-type">
                          <InputLabel className="input-label" >문제 유형</InputLabel>
                          <NativeSelect style={{ margin: "0" }}
                            onChange={(e) => {
                              const type = e.target.value;
                              const changed_type = { ...values }
                              if (type === 'subjective') {
                                changed_type.questions[idx] = { type: "subjective", title: "" }
                              }
                              else {
                                changed_type.questions[idx] = { type: "objective", title: "", choices: [{text: ""}] }
                              }
                              setValues(changed_type)
                            }}
                            input={<BootstrapInput />}
                          >
                            <option aria-label="None" value="" />
                            <option value="objective">객관식</option>
                            <option value="subjective">주관식</option>
                          </NativeSelect>
                        </div>
                      </div>
                      <div className="question-footer"
                        style={{ flexDirection: "row-reverse" }}
                      >
                        <div className="delete-question-button"
                          onClick={() => {
                            const deleted_questions_list = { ...values }
                            deleted_questions_list.questions.splice(idx, 1)
                            setValues(deleted_questions_list)
                          }}
                        >
                          <DeleteForeverIcon color="secondary" />
                          <span>삭제하기</span>
                        </div>
                      </div>
                    </div>

                  )
                }))}
              </FieldArray>
            </div>
            <div className="main-footer">
              <div
                className="add-question-button"
                onClick={() => {
                  let new_question_list = [
                    ...values.questions,
                    {
                      type: "objective",
                      title: "",
                      choices: [{text: ""}]
                    }
                  ]
                  console.log(new_question_list);
                  setValues({ ...values, questions: new_question_list })
                }}
              >
                <AddIcon color="primary" />
                <span>문제 추가</span>
              </div>
              <Button 
                onClick={()=>{
                  validationSchema.validate(values)
                  .then((data)=>alert("감사합니다!"))
                  .catch((err)=>alert("올바른 값을 입력하세요!"))
                }}
                type="submit" 
                variant="contained" 
                color="primary"
              >
                제출하기
              </Button>

            </div>

          </div>
        </form>
      )}
    </Formik>
  </div>

)


export default Survey;