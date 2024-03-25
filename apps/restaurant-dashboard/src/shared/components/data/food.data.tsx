"use client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { Box } from "@mui/material";
import { Icons } from '../../../utils/Icon';
const FoodData = () => {
    const colums: GridColDef<FoodDataType>[] = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.3,
        },
        { field: "name", headerName: "Name", flex: 0.8 },
        { field: "price", type: "number", headerName: "Price", flex: 0.5 },
        { field: "totalOrders", type: "number", headerName: "Total Orders", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: '',
            headerName: "Actions",
            flex: 0.5,
            renderCell: () => {
                return (
                    <div className='md:w-[50%] flex justify-center'>
                        <span className='text-3xl cursor-pointer'>{Icons.delete}</span>
                    </div>
                )
            }
        }
    ];
    const rows: FoodDataType[] = [];

    [...Array(10)].map((i: OrdersDataType) => {
        rows.push({
            id: "123",
            name: "Spicy Chicken Wings",
            price: "12$",
            totalOrders: 10,
            created_at: "2days ago",
        });
    });

    return (
        <Box>
            <Box
                m={"40px 0 0 0"}
                height={"85vh"}
                overflow={"hidden"}
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                        outline: "none",
                    },
                    "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                        color: "#fff",
                    },
                    "& .MuiDataGrid-sortIcon": {
                        color: "#fff",
                    },
                    "& .MuiDataGrid-row": {
                        color: "#fff",
                        borderBottom: "1px solid #ffffff30!important",
                    },
                    "& .MuiTablePagination-root": {
                        color: "#fff",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none!important",
                    },
                    "& .name-column--cell": {
                        color: "#fff",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#3e4396",
                        borderBottom: "none",
                        color: "#fff",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: "#1F2A40",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        color: "#fff",
                        borderTop: "none",
                        backgroundColor: "#3e4396",
                    },
                    "& .MuiCheckbox-root": {
                        color: `#b7ebde !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `#fff !important`,
                    },
                }}
            >
                <DataGrid
                    checkboxSelection={true}
                    rows={rows}
                    columns={colums}
                />
            </Box>
        </Box>
    )
}

export default FoodData