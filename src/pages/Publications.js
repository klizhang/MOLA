import axios from "axios";
import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {parseBibFile, normalizeFieldValue} from "bibtex";


const Publications = () => {
    const [message, setMessage] = useState([]);
    const [years, setYears] = useState([]);
    const [types, setTypes] = useState([]);
    const [topics, setTopics] = useState([]);
    const [filter_year, setFilterYear] = useState('All');
    const [filter_type, setFilterType] = useState('All');
    const [filter_topic, setFilterTopic] = useState('All');
    const [filter_search, setFilterSearch] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const getMessage = async () => {
        const response = await axios.get('http://localhost:5001/api/publications/all/');
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
        setMessage(data);
        setYears(Array.from(res_years));
        setTypes(Array.from(res_types).sort());
        setTopics(Array.from(res_topics).sort());
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const response = await axios.get('http://localhost:5001/api/users/admin/' + localStorage.getItem("email"));
            const data = await response.data;
            if (data !== null) {
                setIsAdmin(data.admin);
            }
            else{
                setIsAdmin(false);
            }
        }
        checkAdmin();
        getMessage();
        
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
        const response = await axios.get('http://localhost:5001/api/contacts/all/');
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
                filtered_publications_set.add(filtered_publications.find(x => x._id === array_filter[i]._id));
            }
            filtered_publications = Array.from(filtered_publications_set);
            setFilterSearch(filter_value);
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

    function getName(str) {
        var first = str.split('{')[1];
        return first.split(',')[0];
    }
    function getType(str){
        var type = str.split('{')[0];
        return type.slice(1);
    }

    async function handleBib(event) {
        event.preventDefault();
        console.log(selectedFiles);
        console.log(selectedFiles.length);
        selectedFiles.forEach(async (element) => {
            var type = getType(element);
            if (type === "inproceedings") {
                type = "Proceeding";
            }
            const name = getName(element);
            const bibFile = parseBibFile(element);
            const entry = bibFile.getEntry(name); // Keys are case-insensitive
            const title = normalizeFieldValue(entry.getField("TITLE"));
            const author = normalizeFieldValue(entry.getField("AUTHOR"));
            var journal = normalizeFieldValue(entry.getField("JOURNAL"));
            if (!journal) {
                journal = "";
            }
            const year = normalizeFieldValue(entry.getField("YEAR"));
            var topics = name.split(year);
            topics.splice(0,1);
            console.log(topics);
            if(topics[0] === title.split(" ")[0].toLowerCase()) {
                topics = ["all"];
            }
            const inputData = {};
            inputData["title"] = title;
            inputData["author"] = author;
            inputData["journal"] = journal;
            inputData["year"] = year;
            inputData["type"] = type;
            inputData["topics"] = topics;
            console.log(inputData);
            const response = await axios.post('http://localhost:5001/api/publications/',inputData);
            await response.data;
            getMessage();

        });

      }

    function onChangeFile(event) {
        var file;
        // var file = event.target.files[0];
        const files = []
        // console.log(file);
        for (let i = 0; i<event.target.files.length;i++){
            file = event.target.files[i];
            var reader = new FileReader();
            reader.onload = function(event) {
                files.push(event.target.result);
            };
            reader.readAsText(file);
        }
        setSelectedFiles(files);
      }

    function FilterComponent(props){
        return (
        <table className="mx-auto">
            <tbody>
                {props.filter_year !== "All" || props.filter_type !== "All" || props.filter_topic !== "All" || props.filter_search !== "" ? 
                <tr>
                    <td>
                        <Form onSubmit={() => filterMessage("publishDate","")}>
                            <Form.Group >
                            <Button  variant="secondary" type="submit">See All </Button>
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
                            <Form.Control name="search" type="text" placeholder="Search" defaultValue={filter_search} />
                        </Form.Group>
                        </Form>
                    </td>
                    
                </tr>
                {isAdmin? 
                    <tr>
                    <td>
                        <Form onSubmit={handleBib}>
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                <Form.Label>Upload bib file(s)</Form.Label>
                                {/* <Form.Control type="file" multiple onChange={(e) => handleChangeBib(e.target.files[0])}/> */}
                                <Form.Control name="files" type="file" accept=".bib" multiple onChange={onChangeFile}/>
                            </Form.Group>
                            <Form.Group >
                            <Button  variant="secondary" type="submit">Upload file(s) </Button>
                            </Form.Group>

                        </Form>
                    </td>

                </tr>
                : null}
                
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
            <div className="d-flex justify-content-start" >
                <div className="w-25"> <FilterComponent filter_year={filter_year} filter_type={filter_type} filter_topic={filter_topic} filter_search={filter_search}/> </div>
                
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
                        {message.length === 0 ? <tbody><tr><td>No results</td></tr></tbody> : null}
                    </table>   
                </div>
            </div>
        </div>
        
    );
  };
  
  export default Publications;