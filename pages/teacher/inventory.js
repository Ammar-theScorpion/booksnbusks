import TeacherLayout from "../../layouts/teacher";
import ModalForm from "../../components/common/modal_form";
import {Form} from "antd";
import {useEffect, useState} from "react";
import FormInput from "../../components/form/FormInput";
import {delProduct, fetchProducts, postProductAdd, postProductUpdate} from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import {checkPermission, useFetch} from "../../helpers/hooks";
import InputFile, {getUploadImageUrl} from "../../components/form/file";
import {useRouter} from "next/router";
import {FiArrowLeft} from "react-icons/fi";
import SearchInput from "../../components/form/search";
import Button from "../../components/form/Button";

const Inventory = () => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [search, setSearch] = useState('')
    const [products, getProducts, {loading}] = useFetch(fetchProducts, {size: 6}, false)

    useEffect(() => {
        getProducts({search: search || undefined})
    }, [search])


    const router = useRouter()
    /*useEffect(() => {
        if(router?.query?.product && products) {
            let product = products?.docs?.find(d => d._id === router?.query?.product)
           handleEdit(product)
            window.history.pushState(null, null, '/teacher/inventory')
        }
    }, [router?.query, products])*/

    const handleEdit = values => {
        form.resetFields()
        form.setFieldsValue({
            ...values,
            image: values?.image?.length > 5 ? [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: values.image
            }] : [],
        })
        setVisible(true)
    }

    const columns = [
        {
            label: 'Name',
            dataIndex: 'name',
            formatter: (name, data) => <div><img className="inline-block h-10 mr-3" src={data.image} alt=""/>{name}
            </div>
        },
        {label: 'Cost', dataIndex: 'cost', shadow: true, className: "text-center"},
        {label: 'Remaining Stock', dataIndex: 'stock', className: "text-center"},
    ]

    const add = checkPermission('inventory_create')

    return (
        <div className="flex flex-col h-fit mt-24 overflow-hidden">
            <div className="flex-1 overflow-hidden"> 

                <ModalForm
                    form={form}
                    visible={visible}
                    setVisible={setVisible}
                    addFunc={async values => {
                        values.image = await getUploadImageUrl(values.image)
                        return postProductAdd(values)
                    }}
                    updateFunc={async values => {
                        values.image = await getUploadImageUrl(values.image)
                        return postProductUpdate(values)
                    }}
                    onFinish={getProducts}
                    title="Product">
                    <FormInput name="name" label="Name" required/>
                    <FormInput name="cost" label="Cost" type="number" required/>
                    <FormInput name="stock" label="Stock" type="number" required/>
                    <InputFile name="image" label="Image" form={form}/>
                </ModalForm>
                <div className="flex justify-between items-center mb-2 sm:flex-row flex-col gap-4">
                    {add && (
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setVisible(true);
                            }}
                        >
                            Add Item
                        </Button>
                    )}
                    <SearchInput value={search} setValue={setSearch} />
                </div>

                <Table
                    data={products}
                    getData={getProducts}
                    columns={columns}
                    loading={loading}
                    action={(
                        <Button onClick={() => {
                            form.resetFields()
                            setVisible(true)
                        }}>Add Item
                        </Button>
                    )}
                    onEdit={handleEdit}
                    onDelete={delProduct}
                    actionLabel={<span className="text-primary">Edit/Delete</span>}
                    permission="inventory"
                    pagination
                    rowCount={6}
                />
            </div>
        </div>
    )
}
Inventory.layout = TeacherLayout;
export default Inventory;