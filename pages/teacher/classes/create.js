import {Form} from "antd";
import Link from 'next/link'
import TeacherLayout from "../../../layouts/teacher";
import FormInput from "../../../components/form/FormInput";
import DaysInput from "../../../components/form/DaysInput";
import FormSelect from "../../../components/form/FormSelect";
import TimeRange from "../../../components/form/TimeRange";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchStudents, fetchTeachers, postClass, fetchClasses} from "../../../helpers/backend_helper";
import {useRouter} from "next/router";
import { FiArrowLeft } from "react-icons/fi";

const CreateClass = () => {
    const router = useRouter()
    const [students] = useFetch(fetchStudents)
    const [teachers] = useFetch(fetchTeachers)

    const handleAdd = async values => {
        await useAction(postClass, values, () => {
            router.push('/teacher/classes')
        });
    }

    // Copy Details From
    const [form] = Form.useForm();

    const [ownedClasses] = useFetch(() => fetchClasses('teacher', { mine: true }));

    const classesOptions = ownedClasses && ownedClasses.length > 0
    ? ownedClasses.map(classItem => ({label: classItem.name, value: classItem._id}))
    : [{label: "You own no other classes", value: null, isDisabled: true}];

    const handleClassSelectionChange = (classId) => {
        if (!classId) return;
    
        const selectedClass = ownedClasses.find(cls => cls._id === classId);
        if (selectedClass) {
            form.setFieldsValue({
                name: selectedClass.name,
                section: selectedClass.section,
                days: selectedClass.days,
                time: selectedClass.time,
                instructors: selectedClass.instructors,  // Assumes instructors is an array of ids
                students: selectedClass.students         // Assumes students is an array of ids
            });
        }
    };


    return (
        <>
            <div>
            <h4 className="font-22 font-semibold"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Create Class</h4>
                <hr className="bg-C4"/>
                <Form layout="vertical" onFinish={handleAdd} form={form}>
                    <FormInput name="name" label="Class Name"
                               placeholder="Enter class name (i.e. ITP 348 Intro to Web Development)" required/>
                    <FormInput name="section" label="Section" placeholder="Enter section"/>
                    <DaysInput name="days" label="Day(s)" required/>
                    <TimeRange name="time" label="Time" required/>
                    <FormSelect
                        name="copyFromClass"
                        label="Copy details from"
                        placeholder="Select a class"
                        initialValue={null}
                        options={classesOptions}
                        onChange={handleClassSelectionChange}
                    />
                    <FormSelect
                        name="instructors"
                        label="Instructors"
                        initialValue={[]}
                        options={teachers?.map(teacher => ({label: `${teacher?.first_name} ${teacher?.last_name}`, value: teacher?._id}))}
                        isMulti search/>
                    <div className="area-select">
                        <FormSelect
                            name="students"
                            label="Students"
                            placeholder="Enter students"
                            initialValue={[]}
                            options={students?.map(student => ({label: `${student?.first_name} ${student?.last_name}`, value: student?._id}))}
                            isMulti search/>
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-primary mr-4">Save</button>
                        <Link href="/teacher/classes">
                            <a className="btn btn-secondary">Cancel</a>
                        </Link>
                    </div>
                </Form>
            </div>

        </>
    )
}

CreateClass.layout = TeacherLayout
export default CreateClass