import TeacherLayout from "../../layouts/teacher";
import {useFetch} from "../../helpers/hooks";
import {fetchClasses, fetchTeachers} from "../../helpers/backend_helper";
import {useRouter} from "next/router";
import {Table} from "react-bootstrap";
import {FiArrowLeft} from "react-icons/fi";
import {useEffect, useState} from "react";
import SearchInput from "../../components/form/search";
import {forEach} from "react-bootstrap/ElementChildren";

const Roster = () => {
    const router = useRouter()
    //const [teachers] = useFetch(fetchTeachers)
    const [classes] = useFetch(fetchClasses)
    const [search, setSearch] = useState('');
    const [teachers, setTeachers] = useState([]);
    let teacherClass = {}
    
    useEffect(()=>{
        if(classes){
            for(const class_ of classes){
                const instructors = class_.instructors;
                for(const instructor of instructors) {
                    if(!teacherClass[instructor._id]){
                        teacherClass[instructor._id] = instructor;
                        teacherClass[instructor._id].name = instructor.first_name + ' '+instructor.last_name;
                        teacherClass[instructor._id].className = [class_.name];
                    }else{
                        teacherClass[instructor._id].className.push(class_.name);
                    }
                }
            }
            console.log(teacherClass);
            console.log(classes);
            setTeachers(teacherClass);
        }
    }, [classes]);
    /*teachers?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).forEach(teacher => {
        map[teacher._id] = teacher
    })
    classes?.map(data => {
        data.instructors?.map(teacher => {
            let list = map[teacher?._id]?.classes || {}
            list[data._id] = data
            map[teacher?._id] = {
                ...map[teacher?._id],
                classes: list
            }
        })
    })
    let list = []
    Object.values(map).forEach(teacher => {
        if(`${teacher?.first_name} ${teacher?.last_name}`.toLowerCase().includes(search.toLowerCase())) {
            if (teacher?.classes) {
                Object.values(teacher?.classes).forEach((data, index) => {
                    list.push({
                        name: index === 0 ? `${teacher?.first_name} ${teacher?.last_name}` : '',
                        classes: Object.values(teacher?.classes)?.length,
                        class: {
                            _id: data?._id,
                            name: data?.name,
                            email: teacher.email
                        }
                        
                    })
                })
            } else {
                list.push({
                    name: `${teacher?.first_name} ${teacher?.last_name}`,
                })
            }
        }
    })*/

    return (
<>
<div className="flex justify-between items-center mb-5">
        <h4 className="text-xl font-bold flex items-center">
            <FiArrowLeft 
                className="mr-2 cursor-pointer" 
                onClick={() => router.back()}
            />
            Classes Roster
        </h4>
        <SearchInput value={search} setValue={setSearch} />
    </div>

    {/* Classes with Teachers Section */}
    <h5 className="text-lg font-semibold mb-3">Classes with Teachers</h5>
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 font-medium">Class Name</th>
                    <th className="px-4 py-2 font-medium">Teacher</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Start At</th>
                    <th className="px-4 py-2 font-medium">End At</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(teachers)?.map((classData, index) => (
                    <tr 
                        key={index} 
                        className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                        <td className="px-4 py-2">{classData.className}</td>
                        <td className="px-4 py-2">{classData.name}</td>
                        <td className="px-4 py-2">{classData.email}</td>
                        <td className="px-4 py-2">{classData.startAt}</td>
                        <td className="px-4 py-2">{classData.endAt}</td>
                        <td className="px-4 py-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    classData.type === "Dashboard" 
                                        ? "bg-purple-100 text-purple-600" 
                                        : "bg-orange-100 text-orange-600"
                                }`}
                            >
                                {classData.type}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>


    {/* Classes with No Teachers Section 
    <h5 className="mt-6 mb-2 text-lg font-semibold">Classes with No Teachers</h5>
        <Table>
            <thead>
                <tr>
                    <th>Class Name</th>
                    <th>Start At</th>
                    <th>End At</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {classesWithoutTeachers?.map((classData, index) => (
                    <tr key={index}>
                        <td>{classData.className}</td>
                        <td>{classData.startAt}</td>
                        <td>{classData.endAt}</td>
                        <td>
                            <span 
                                className={`status-badge ${
                                    classData.type === "Dashboard" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"
                                }`}
                            >
                                {classData.type}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        */}
    </>

    )
}

Roster.layout = TeacherLayout
export default Roster

{/* {data.name &&  <td className="font-semibold border-r border-gray-200" rowSpan={data?.classes}>{data?.name}</td>}
    <td onClick={() => {
        if(data.class?._id) {
            router.push('/teacher/classes/' + data.class?._id)
        }
    }}
        role={data?.class?.name ? "button" : undefined}> {data?.class?.name || ''}</td>
    <td> 
        {data?.class?.email ? (
                <a href={`mailto:${data.class.email}`}>{data.class.email}</a>
            ) : (
                ''
            )}
    </td>
        */}