import TeacherLayout from "../../layouts/teacher";
import {useFetch} from "../../helpers/hooks";
import {fetchClasses, fetchTeachers} from "../../helpers/backend_helper";
import {useRouter} from "next/router";
import {Table} from "react-bootstrap";
import {FiArrowLeft} from "react-icons/fi";
import {useEffect, useState} from "react";
import SearchInput from "../../components/form/search";
import {forEach} from "react-bootstrap/ElementChildren";
import TableSkeleton from "../../fragment/skeleton/TableSkeleton";

const Roster = () => {
    const router = useRouter()
    //const [teachers] = useFetch(fetchTeachers)
    const [classes, getData,  {loading}] = useFetch(fetchClasses)
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
                        teacherClass[instructor._id].classInstance = [class_];
                    }else{
                        teacherClass[instructor._id].classInstance.push(class_);
                    }
                }
            }
            console.log(teacherClass);
            console.log(classes);
            setTeachers(teacherClass);
        }
    }, [classes]);

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const isPM = hour >= 12;
        const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
        const suffix = isPM ? 'PM' : 'AM';
        return `${formattedHour}:${minute} ${suffix}`;
    };
    console.log(loading)
    if(loading) {
        
        return (
            <TableSkeleton columnCount={3} rowCount={10} pagination={false}/>
        )
    }
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
            <table className="w-full text-sm text-left rounded-lg shadow-md ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-3 font-medium uppercase">Teacher</th>
                        <th className="px-4 py-3 font-medium uppercase">E-mail</th>
                        <th className="px-4 py-3 font-medium uppercase">Class</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(teachers)?.map((classData, index) => (
                        <tr className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>

                            {/* Teacher Name */}
                            <td className="px-4 py-3 font-medium text-gray-700">{classData.name}</td>

                            {/* Email with hover effect */}
                            <td className="px-4 py-3 text-primary-600 ">
                                {classData.email}
                            </td>

                            {/* Class Cards */}
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-3">
                                    {classData.classInstance.map((instance, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => router.push('/teacher/classes/' + instance._id)} 
                                            className="hover:cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-500 hover:scale-105 transition-all duration-500 flex flex-col justify-center items-start p-2 rounded-lg shadow-md hover:shadow-lg"
                                        >
                                            {/* Class Name */}
                                            <div className="text-white font-semibold text-sm">
                                                {instance.name}
                                            </div>

                                            {/* Class Time */}
                                            <div className="flex items-center gap-1 text-gray-200 font-light text-xs mt-1">
                                                <span className="material-icons text-sm">schedule</span>
                                                {formatTime(instance.time.start)} - {formatTime(instance.time.end)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>


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
