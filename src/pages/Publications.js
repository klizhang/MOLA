import axios from "axios";
import React, { useState, useEffect } from "react";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

const Publications = () => {
    const [message, setMessage] = useState([]);
    const [years, setYears] = useState([]);
    const [types, setTypes] = useState([]);
    const [topics, setTopics] = useState([]);
    const [filter_year, setFilterYear] = useState([]);
    const [filter_type, setFilterType] = useState([]);
    const [filter_topic, setFilterTopic] = useState([]);


    // const [years, setYears] = useState(() => new Set());

    // useEffect(() => {
    //     fetch("http://localhost:5001/message")
    //     .then((res) => res.json())
    //     .then((data) => setMessage(data.message));
    // }, []);
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
            console.log(data);
            setMessage(data);
            setYears(Array.from(res_years));
            setTypes(Array.from(res_types).sort());
            setTopics(Array.from(res_topics).sort());
            // setTopics(myarr);

            console.log(res_topics);  
        };
        
        getMessage();
        setFilterYear("All");
        setFilterType("All");
        setFilterTopic("All");

        // console.log(years);
        
    }, []);
    

    async function handleContact(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        const form = e.target;
        const formData = new FormData(form);
        formData.append("user_id",localStorage.getItem("userID"));
        const formJson = Object.fromEntries(formData.entries());
        try{
          const response = await axios.post('http://localhost:5001/api/contacts/',formJson);
          console.log(response.data);
          setMessage(JSON.stringify(response.data));
        } catch (error) {
          console.log(error.response.data.message);
          setMessage(error.response.data.message);
          console.log(message);
        }
    }

    // const filterMessage = async (filter_name,filter_value) => {
    //     const response = await axios.get('http://localhost:5001/api/contacts/allcontacts/');
    //     const data = await response.data;
    //     // const filtered_publications = data.filter((item) => )
    //     var filtered_publications = data.filter(function (item) {
    //         return item[filter_name] === filter_value;
    //       });
    //     // setMessage(filtered_publications);
    //     console.log(filtered_publications);
    //     // setTopics(myarr);
    // };

    async function filterMessage(filter_name,filter_value) {
        const response = await axios.get('http://localhost:5001/api/contacts/allcontacts/');
        const data = await response.data;
        console.log(filter_name);
        console.log(filter_value);

        // const filtered_publications = data.filter((item) => )
        if (filter_name === "topic") {
            var filtered_publications = data.filter(function (item) {
                // return item.publishDate === filter_value.item;
                return item.topic.includes(filter_value.item);
              });
            setFilterTopic(filter_value.item)
        }
        else{
            var filtered_publications = data.filter(function (item) {
                // return item.publishDate === filter_value.item;
                return item[filter_name] === filter_value.item;
              });
        }
        setMessage(filtered_publications);
        console.log(filtered_publications);
        // setTopics(myarr);
    }



    function FilterComponent(){
            return (
                <>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <Dropdown>
                                <Dropdown.Toggle variant="" id="dropdown-basic">
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
                                <Dropdown.Toggle variant="" id="dropdown-basic">
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
                                <Dropdown.Toggle variant="" id="dropdown-basic">
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
                    </tbody>
                    
                </table>
                </>
                
            )
    }
    function Sup ({item}){
        if (item) {
            return <a href = {item}>Supplementary material</a>;
        }
       }

   function Bib ({item}){
    if (item) {
        return <a href = {item}>bib</a>;
    }
   }

   function Osf ({item}){
    if (item) {
        return <a href = {item}>OSF</a>;
    }
   }
    return (
        
        <div>
            <div> <h1> Publications</h1></div>
            {/* <table>
                {years.map((item, index) => (
                    <tbody key={index}>
                            <tr>
                                <td>{item}</td>
                            </tr>
                    </tbody>
                    ))
                }
                </table>   */}
                {/* {years} */}
            <div style={{display: 'flex', justifyContent:'flex-front'}}> <FilterComponent/> </div>
            <div style={{display: 'flex', justifyContent:'flex-front'}}>
            <table >
                {message.map((item, index) => (
                    <tbody key={index}>
                            <tr >
                                <td className="ms-auto"><a href = {item.href}>{item.title}</a></td>
                            </tr>
                            <tr>
                                <td>{item.description} <Sup item={item.supplementary} /> <Bib item={item.bib} /><Osf item={item.osf} /></td>
                            </tr>
                    </tbody>
                    ))
                }
                </table>   
            </div>
            
            

                 
                
            
            {/* {DisplayData} */}
        </div>
        
    );
  };
  
  export default Publications;