import axios from "axios";
import React, { useState, useEffect } from "react";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Publications = () => {
    const [message, setMessage] = useState([]);
    const [years, setYears] = useState([]);
    const [types, setTypes] = useState([]);
    const [topics, setTopics] = useState([]);
    const [filter_year, setFilterYear] = useState('All');
    const [filter_type, setFilterType] = useState('All');
    const [filter_topic, setFilterTopic] = useState('All');

    useEffect(() => {
        const getMessage = async () => {
            const response = await axios.get('http://localhost:5001/api/contacts/allcontacts/');
            const data = await response.data;
            const res_years = new Set();
            for (let i=0; i<data.length;i++){
                res_years.add(data[i].publishDate);
            }
            const res_types = new Set();
            for (let i=0; i<data.length;i++){
                res_types.add(data[i].type);
            }
            const res_topics = new Set();
            for (let i=0; i<data.length;i++){
                for (let j=0; j<data[i].topic.length;j++) {
                    res_topics.add(data[i].topic[j]);
                }
            }
            res_topics.delete("all");
            // console.log(data);
            setMessage(data);
            setYears(Array.from(res_years));
            setTypes(Array.from(res_types).sort());
            setTopics(Array.from(res_topics).sort());
            // setTopics(myarr);
            // console.log(res_topics);  
        };
        
        getMessage();
        // setFilterYear("All");
        // setFilterType("All");
        // setFilterTopic("All");

        // console.log(years);
        
    }, []);


    function lower(obj) {
        for (var prop in obj) {
        if (typeof obj[prop] === 'string') {
          obj[prop] = obj[prop].toLowerCase();
        }
        if (typeof obj[prop] === 'object') {
          lower(obj[prop]);
          }
        }
        return obj;
      }

    async function filterMessage(filter_name,filter_value) {
        const response = await axios.get('http://localhost:5001/api/contacts/allcontacts/');
        const data = await response.data;
        var filtered_publications = data;
        if (filter_name === "publishDate") {
            filtered_publications = filtered_publications.filter(function (item) {
                return item[filter_name] === filter_value.item;
            });
            setFilterYear(filter_value.item);
        }
        else if (filter_name === "type") {
            filtered_publications = filtered_publications.filter(function (item) {
                return item[filter_name] === filter_value.item;
            });
            setFilterType(filter_value.item);
        }
        else if (filter_name === "topic") {
            filtered_publications = filtered_publications.filter(function (item) {
                // return item.publishDate === filter_value.item;
                return item.topic.includes(filter_value.item);
            });
            setFilterTopic(filter_value.item);
        }
        else if (filter_name === "search") {
            var low_search = filter_value.toLowerCase();
            const lower_publications = structuredClone(filtered_publications);
            var search_filter = lower(lower_publications);

            var title_filter = search_filter.filter(( item ) => 
                item.title.includes(low_search)
            );
            var description_filter = search_filter.filter(( item ) => 
                item.description.includes(low_search)
            );
            var type_filter = search_filter.filter(( item ) => 
                item.type.includes(low_search)
            );
            // console.log(description_filter);
            const filter_set = new Set();
            for (let i = 0; i<title_filter.length; i++) {
                filter_set.add(title_filter[i]);
            }
            for (let i = 0; i<description_filter.length; i++) {
                filter_set.add(description_filter[i]);
            }
            for (let i = 0; i<type_filter.length; i++) {
                filter_set.add(type_filter[i]);
            }
            var array_filter = Array.from(filter_set);
            const filtered_publications_set = new Set();
            for (let i = 0; i<array_filter.length;i++) {
                console.log(array_filter[i]._id);
                // filtered_publications = filtered_publications.filter(x => x._id === array_filter[i]._id);
                filtered_publications_set.add(filtered_publications.find(x => x._id === array_filter[i]._id));
            }
            filtered_publications = Array.from(filtered_publications_set);
        }
        else{
            setFilterYear("All");
            setFilterType("All");
            setFilterTopic("All");
        }
        if (filter_year !== "All" && filter_name !== "publishDate") {
            filtered_publications = filtered_publications.filter(function (item) {
                return item["publishDate"] === filter_year;
            });
        }
        if (filter_type !== "All" && filter_name !== "type") {
            filtered_publications = filtered_publications.filter(function (item) {
                return item["type"] === filter_type;
            });
        }
        if (filter_topic !== "All" && filter_name !== "topic") {
            filtered_publications = filtered_publications.filter(function (item) {
                return item.topic.includes(filter_topic);
            });
        }
        setMessage(filtered_publications);
        console.log(filtered_publications);

    }

    async function handleSearch(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson.search);
        filterMessage("search",formJson.search);
    }

    function FilterComponent(props){
        return (
        <table className="mx-5">
            <tbody>
                {props.filter_year !== "All" || props.filter_type !== "All" || props.filter_topic !== "All" ? 
                <tr>
                    <td>
                        <Form onSubmit={() => filterMessage("publishDate","")}>
                            <Form.Group>
                            <Button type="submit">See All </Button>
                            </Form.Group>
                        </Form>
                    </td>
                </tr> : null} 
                
                <tr>
                    <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="">
                            Year:{filter_year}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {years.map((item, index) => (
                                // <Dropdown.Item key={index} eventKey={item} onClick={function(evt){console.log(evt); console.log("here")}}>
                                // <Dropdown.Item key={index} eventKey={item} onClick={filterMessage("publishDate","2020")}>
                                <Dropdown.Item key={index} eventKey={item} onClick={() => filterMessage("publishDate",{item})}>
                                        {item}
                                </Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
                    
                </tr>
                <tr>
                    <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="">
                            Type:{filter_type}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {types.map((item, index) => (
                                // <Dropdown.Item key={index} href={item}>
                                <Dropdown.Item key={index} eventKey={item} onClick={() => filterMessage("type",{item})}>
                                    {item}
                                </Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
                    
                </tr>
                <tr>
                    <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="">
                            Topic:{filter_topic}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {topics.map((item, index) => (
                                // <Dropdown.Item key={index} href={item}>
                                <Dropdown.Item key={index} eventKey={item} onClick={() => filterMessage("topic",{item})}>
                                        {item}
                                </Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Form onSubmit={handleSearch}>
                        <Form.Group className="mb-3" controlId="searchGroup">
                            <Form.Control name="search" type="text" placeholder="Search" />
                        </Form.Group>
                        </Form>
                    </td>
                    
                </tr>
            </tbody>
        </table>
        )
    }

   function Links(props) {
        if (props.item) {
            return <a style={{'textDecoration': 'none'}} href = {props.item}> {props.name}</a>;
        }
   }
    return (
        
        <div>
            <div > <h1 className="text-start ms-5"> Publications</h1></div>
            <div className="d-flex justify-content-between" >
                <div className="mx-5"> <FilterComponent filter_year={filter_year} filter_type={filter_type} filter_topic={filter_topic}/> </div>
                <div className="">
                    <table>
                        {message.map((item, index) => (
                            <tbody key={index}>
                                    <tr >
                                        <td className="fs-4" ><a style={{'textDecoration': 'none'}} href = {item.href}>{item.title}</a></td>

                                    </tr>
                                    <tr>
                                        <td>{item.description} </td>
                                    </tr>
                                    <tr>
                                        <td> <Links item={item.supplementary} name="Supplementary" /> {item.supplementary && item.bib ? " |" : ""} <Links item={item.bib} name="bib"/> {item.bib && item.osf ? " |" : ""} {item.supplementary && item.osf && !item.bib ? " |" : ""}<Links item={item.osf} name="OSF"/></td>
                                    </tr>
                            </tbody>
                            ))
                        }
                    </table>   
                </div>
            </div>
            {/* <div style={{display: 'flex', justifyContent:'flex-front'}}> <FilterComponent/> </div> */}
            
        </div>
        
    );
  };
  
  export default Publications;