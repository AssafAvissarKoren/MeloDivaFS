import { trackService } from "../../services/track.service";
import { SET_PLAYER_TRACK } from "../reducers/track.reducer";
import { store } from "../store";


export async function setPlayerTrack(video) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await trackService.setPlayerTrack(video)
        store.dispatch({ type: SET_PLAYER_TRACK, video })
    } catch (err) {
        console.log('Had issues setting player track', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }

}
