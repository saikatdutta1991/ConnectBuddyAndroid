import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { Container, Text, Thumbnail, Icon, Button, Left, Right } from 'native-base';
import customColor from '../../../../native-base-theme/variables/customColor';
import authuser from "../../../AuthUser";
import Socket from "../../../Socket";
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';

const SEND_CALL = 'SEND_CALL';
const RECEIVE_CALL = 'RECEIVE_CALL';
const ONGOIN_CALL = 'ONGOIN_CALL';
const TIMEOUT = 30;


export default class SendCall extends React.Component {

    socket;
    sendRequestTimer;
    timeTick = 0;
    peerConnection;
    localStream;

    constructor(props) {
        super(props);
        this.state = {
            view_type: '',
            callee: {},
            caller: {},
            call_status_text: '',
            is_caller: true,
        };
    }

    async componentDidMount() {
        this.props.navigation.addListener('willFocus', this._onFocus);
        this.socket = Socket.instance(authuser.getId());
        this.socket.on('is_connected_vc', this._isConnectedHandler);
        this.socket.on('vc_rejected', this._handleRejectCall);
        this.socket.on('vc_accepted', this._handleAccptedCall);
    }


    _handleAccptedCall = async () => {
        this.setState({ call_status_text: 'Call accepted' });
        clearInterval(this.sendRequestTimer);

        this.peerConnection = createPeerConnection({
            handleNegotiationNeededEvent: this._handleNegotiationNeededEvent
        });

        this.localStream = await getUserMedia(true, 60, true);
        this.setState({ localStreamURL: this.localStream.toURL(), view_type: ONGOIN_CALL });
        this.peerConnection.addStream(this.localStream);

    }


    _handleNegotiationNeededEvent = async () => {

        let offer = await this.peerConnection.createOffer();
        this.peerConnection.setLocalDescription(offer);
        this.socket.emit('vc_exchange', {
            usertype: 'user',
            userid: this.state.callee._id,
            type: 'video-offer',
            sdp: this.peerConnection.localDescription
        });

    }


    _handleRejectCall = () => {
        this.setState({ call_status_text: 'Call rejected' });
        clearInterval(this.sendRequestTimer);
        setTimeout(() => {
            this.props.navigation.navigate('Chat');
        }, 1000)
    }


    _sendCallRequest = () => {

        this.setState({ call_status_text: 'Ringing..' });

        this.timeTick = 0;
        this.sendRequestTimer = setInterval(() => {

            if (this.timeTick++ >= TIMEOUT) {
                this.setState({ call_status_text: 'Call timeout' });
                clearInterval(this.sendRequestTimer);
                setTimeout(() => {
                    this.props.navigation.navigate('Chat');
                }, 1000)
                return;
            }

            this.socket.emit('send_vc', {
                calleeType: 'user',
                calleeId: this.state.callee._id,
                callerId: this.state.caller._id,
                callerName: this.state.caller.name,
                callerImageurl: this.state.caller.image_url
            });

        }, 1000);
    }



    _isConnectedHandler = ({ isConnected }) => {
        if (isConnected) {
            this.setState({ call_status_text: 'Connected..' });
            this._sendCallRequest();
            return;
        }

        this.setState({ call_status_text: 'Connection failed..' });
        setTimeout(() => {
            this.props.navigation.navigate('Chat');
        }, 1000)

    }


    _onFocus = async () => {

        await this.setState({
            view_type: this.props.navigation.getParam('view_type'),
            callee: this.props.navigation.getParam('callee'),
            caller: this.props.navigation.getParam('caller'),
            is_caller: this.props.navigation.getParam('is_caller')
        });

        if (this.state.view_type == SEND_CALL) {
            //this._connectCallee();
            this._handleAccptedCall();
        }

    }


    _connectCallee = () => {
        this.setState({ call_status_text: 'Connecting..' });
        this.socket.emit('connect_for_vc', { calleeType: 'user', calleeId: this.state.callee._id });
    }



    _sendCallRender() {
        return (
            <Container style={styles.container}>

                <Thumbnail source={{ uri: this.state.callee.image_url }}
                    style={styles.thumbnail}
                />

                <View style={{ flexDirection: 'row' }}>
                    <ActivityIndicator size="large" color={customColor.brandPrimary} />
                    <Text style={styles.statusText}>{this.state.call_status_text}</Text>
                </View>

                <View style={{ marginTop: 100 }}>
                    <Icon
                        active
                        name='phone'
                        style={{ fontSize: 50, color: 'white', backgroundColor: 'red', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 100 }}
                        type='FontAwesome'
                    />
                </View>



            </Container >
        );
    }



    _inComingCallRender() {
        return (
            <Container style={styles.container}>

                <Thumbnail source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSCwHFNJJrWerYxEagpJ9LO8fEDZMQOXSRsoAz3hZyFW170KdA' }}
                    style={styles.thumbnail}
                />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.statusText}>Saikat Dutta is calling..</Text>
                </View>

                <View style={{ marginTop: 100, flexDirection: 'row' }}>
                    <Left style={{ paddingLeft: 30 }}>
                        <Icon
                            active
                            name='phone'
                            style={{ fontSize: 50, color: 'white', backgroundColor: 'red', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 100 }}
                            type='FontAwesome'
                        />
                    </Left>
                    <Right style={{ paddingRight: 30 }}>
                        <Icon
                            name='phone'
                            style={{ fontSize: 50, color: 'white', backgroundColor: 'green', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 100 }}
                            type='FontAwesome'
                        />
                    </Right>
                </View>



            </Container >
        );
    }

    _renderOngoingCall = () => {
        return (
            <Container style={{}}>
                {
                    this.state.remoteStreamURL &&
                    <RTCView streamURL={this.state.remoteStreamURL} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
                }
                {
                    this.state.localStreamURL &&
                    <RTCView streamURL={this.state.localStreamURL} style={{ position: 'absolute', bottom: 10, right: 10, maxWidth: 100, minWidth: 50, height: 100 }} />
                }
            </Container>
        );
    }


    render() {

        if (this.state.view_type == SEND_CALL) {
            return this._sendCallRender();
        } else if (this.state.view_type == RECEIVE_CALL) {
            return this._inComingCallRender();
        } else {
            return this._renderOngoingCall();
        }

    }



}

const styles = StyleSheet.create({
    statusText: {
        color: customColor.brandPrimary,
        fontSize: 25
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: customColor.brandLight
    },
    thumbnail: {
        width: 200,
        height: 200,
        marginBottom: 50,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: customColor.brandPrimary
    }
});




var createPeerConnection = ({
    handleNegotiationNeededEvent,
    handleICECandidateEvent,
    handleTrackEvent,
    handleRemoveTrackEvent,
    handleICEConnectionStateChangeEvent,
    handleICEGatheringStateChangeEvent,
    handleSignalingStateChangeEvent,
    handleAddStreamEvent
}) => {

    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    myPeerConnection = new RTCPeerConnection(configuration);
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.onaddstream = handleAddStreamEvent;
    myPeerConnection.ontrack = handleTrackEvent;
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnection.onremovetrack = handleRemoveTrackEvent;
    myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;

    return myPeerConnection;
}



var getUserMedia = async (isAudio = true, minFrameRate = 50, isFront = true) => {

    let videoSourceId;
    let deviceSources = await mediaDevices.enumerateDevices();

    deviceSources.forEach(deviceInfo => {
        if (deviceInfo.kind == "video" && deviceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = deviceInfo.id;
        }
    });


    return mediaDevices.getUserMedia({
        audio: isAudio,
        video: {
            mandatory: {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
                minFrameRate: minFrameRate
            },
            facingMode: (isFront ? "user" : "environment"),
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
    });

}