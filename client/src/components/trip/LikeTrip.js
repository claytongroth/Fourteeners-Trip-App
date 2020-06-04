import React from 'react';
import withSession from '../WithSession';
import { Mutation } from 'react-apollo';
import {LIKE_TRIP, UNLIKE_TRIP, GET_TRIP} from '../../queries';

class LikeTrip extends React.Component{
    state = {
        username: "",
        liked: false

    };
    componentDidMount() {
        if (this.props.session.getCurrentUser){
            const {username, favorites} = this.props.session.getCurrentUser;
            const {_id} = this.props;
            const prevLiked = favorites.findIndex(fav => fav._id === _id);
            this.setState({
                liked: prevLiked,
                username
            });
        }
    }
    handleLike = (likeTrip, unlikeTrip) =>{
        if (this.state.liked) { 
            likeTrip().then( async ({data})=>{
                //console.log(data);
                await this.props.refetch;
            })
        } else {
            unlikeTrip().then( async ({data})=>{
                //console.log(data);
                await this.props.refetch;
            })
        }
    }
    handleClick = (likeTrip, unlikeTrip) => {
        this.setState(prevState => ({
            liked: !prevState.liked
        }),
        () => this.handleLike(likeTrip, unlikeTrip)
        );
    }
    updateLike = (cache, {data:{likeTrip}}) => {
        const {_id} = this.props;
        const {getTrip} = cache.readQuery({query: GET_TRIP, variables:{_id}});
        cache.writeQuery({
            query: GET_TRIP,
            variables: {_id},
            data: {
                getTrip: {...getTrip, likes:likeTrip.likes + 1 }
            }
        })
    }
    updateUnlike = (cache, {data:{unlikeTrip}}) => {
        const {_id} = this.props;
        const {getTrip} = cache.readQuery({query: GET_TRIP, variables:{_id}});
        cache.writeQuery({
            query: GET_TRIP,
            variables: {_id},
            data: {
                getTrip: {...getTrip, likes:unlikeTrip.likes - 1 }
            }
        })
    }
    render(){
        
        const {liked, username} = this.state;
        const { _id } = this.props;
        console.log(this.props, _id)
        return(
            <Mutation 
                mutation={UNLIKE_TRIP} 
                variables={{_id, username}}
                update={this.updateUnlike}
            >
                { unlikeTrip =>(
                        <Mutation 
                            mutation={LIKE_TRIP} 
                            variables={{_id, username}}
                            update={this.updateLike}
                        >
                            {likeTrip =>{
                                return username && <button onClick={()=>this.handleClick(likeTrip, unlikeTrip)}>
                                                        {liked ? "Unlike" : "Like"}
                                                    </button>;
                            }}
                            
                        </Mutation>
                    )
                }

            </Mutation>
        )
    }
}

export default withSession(LikeTrip);