import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { SEARCH_TRIPS } from '../../queries';
import SearchItem from './SearchItem';

class Search extends React.Component {
    state = {
        searchResults: []
    }
    handleChange = ({searchTrips}) => {
        this.setState({
            searchResults: searchTrips
        });
    }
    render(){
        const { searchResults } = this.state;
        return (
            <ApolloConsumer>
                { client =>{
                    return (
                        <div className="App">
                            <input 
                                onChange={async e =>{
                                    e.persist();
                                    const { data } = await client.query({
                                        query: SEARCH_TRIPS,
                                        variables: {searchTerm: e.target.value}
                                    });
                                    this.handleChange(data);
                                }} 
                                placeholder="Search for Trip Reports..." 
                                type="search"
                            >
                            </input>
                            <ul>
                                {searchResults.map(trip =>
                                    <SearchItem key={trip._id} {...trip}/>
                                )}
                            </ul>
                        </div>
                    )
                }}
            </ApolloConsumer>
        )
    }
};

export default Search;