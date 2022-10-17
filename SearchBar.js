import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    handleTermChange(e){
        this.setState({
            searchValue: e.target.value
        })
    }

    search(){
        this.props.onSearch(this.state.searchValue)
    }
    render(){
        return(
        <div className="SearchBar">
            <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist"/>
            <button className="SearchButton">SEARCH</button>
        </div>)
    }
}

export default SearchBar;