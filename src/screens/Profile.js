import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Image, ActivityIndicator } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Content, Input, Text, Toast, ActionSheet } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import CustomColor from '../../native-base-theme/variables/customColor';
import authuser from "../AuthUser";
import ImagePicker from 'react-native-image-crop-picker';
import Services from '../Services';
import gStorage from "../GInmemStorage";

export default class Proflie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_imageurl: authuser.getImageurl(),
            authuser_newpassword: '',
            uploadActivity: false,
            profileLoading: false,
            updateProfileLoading: false
        };
    }


    async componentDidMount() {

        /** fetch profile and update input */
        this.setState({ profileLoading: true });
        let response = await Services.getProfile();
        this.setState({ profileLoading: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        /** successs  */
        await authuser.setId(response.data.user._id)
            .setName(response.data.user.name)
            .setEmail(response.data.user.email)
            .setImageurl(response.data.user.image_url)
            .save();

        this.setState({
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_imageurl: authuser.getImageurl()
        });


    }




    /** update user profile */
    _doUpdate = async () => {

        this.setState({ updateProfileLoading: true });
        let response = await Services.updateProfile(this.state.authuser_name, this.state.authuser_email, this.state.authuser_newpassword);
        this.setState({ updateProfileLoading: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        /** check if v_error */
        if (!response.success && response.type == 'v_error') {
            Toast.show({
                text: response.data[Object.keys(response.data)[0]],
                buttonText: 'Okay',
                type: "danger"
            })
            return;
        }


        /** successs  */
        await authuser.setName(response.data.user.name)
            .setEmail(response.data.user.email)
            .save();

        this.setState({
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_newpassword: ''
        });

        /** set image and name to sidebar */
        gStorage.mainMenu.setState({ authuser_name: authuser.getName() });

        Toast.show({
            text: 'Profile updated successfully',
            buttonText: 'Okay',
            type: "success"
        })


    }


    _onUpdateImagePress = () => {

        ActionSheet.show(
            {
                options: ['Open Camera', "Choose from Gallery"],
                title: "Select an option"
            },
            buttonIndex => {

                /** open galllery */
                if (buttonIndex == 1) {
                    this._openGallery();
                } else if (buttonIndex == 0) {
                    this._openCamera();
                }
            }
        )
    }


    _openCamera() {
        this.setState({ uploadActivity: true });

        ImagePicker.openCamera({
            width: 200,
            height: 300,
            cropping: true
        }).then(async image => {

            console.log(image);


            let filename = image.path.substring(image.path.lastIndexOf('/') + 1);
            let response = await Services.uploadPhoto(image.path, image.mime, filename);
            this.setState({ uploadActivity: false });

            if (!response) {
                Toast.show({
                    text: 'Failed to upload image',
                    buttonText: 'Okay',
                    type: "danger"
                });
                return false;
            }

            /** check if v_error */
            if (!response.success) {
                Toast.show({
                    text: response.message,
                    buttonText: 'Okay',
                    type: "danger"
                })
                return;
            }

            /** store auth user data */
            await authuser.setImageurl(response.data.user.image_url).save();

            this.setState({ authuser_imageurl: image.path })

            /** set image and name to sidebar */
            gStorage.mainMenu.setState({ authuser_image: image.path });


        }).catch(err => {
            Toast.show({
                text: 'Failed to upload image',
                buttonText: 'Okay',
                type: "danger"
            })
            this.setState({ uploadActivity: false });
        })
    }




    _openGallery = () => {

        this.setState({ uploadActivity: true });

        ImagePicker.openPicker({
            width: 200,
            height: 300,
            cropping: true
        }).then(async image => {

            console.log(image);


            let filename = image.path.substring(image.path.lastIndexOf('/') + 1);
            let response = await Services.uploadPhoto(image.path, image.mime, filename);
            this.setState({ uploadActivity: false });

            if (!response) {
                Toast.show({
                    text: 'Failed to upload image',
                    buttonText: 'Okay',
                    type: "danger"
                });
                return false;
            }

            /** check if v_error */
            if (!response.success) {
                Toast.show({
                    text: response.message,
                    buttonText: 'Okay',
                    type: "danger"
                })
                return;
            }

            /** store auth user data */
            await authuser.setImageurl(response.data.user.image_url).save();

            this.setState({ authuser_imageurl: image.path })

            /** set image and name to sidebar */
            gStorage.mainMenu.setState({ authuser_image: image.path });


        }).catch(err => {
            Toast.show({
                text: 'Failed to upload image',
                buttonText: 'Okay',
                type: "danger"
            })
            this.setState({ uploadActivity: false });
        })

    }


    _imageContent() {
        return (
            <View style={styles.imageOuterContainer}>
                <View style={styles.imageInnerContainer}>
                    <Image resizeMode="cover" source={{ uri: this.state.authuser_imageurl }} style={styles.userImage} />
                    <View style={styles.cameraIconWrapper}>
                        {
                            this.state.uploadActivity ?
                                <ActivityIndicator size="small" color={CustomColor.brandPrimary} />
                                :
                                <Icon name="camera" type='FontAwesome' onPress={this._onUpdateImagePress} />
                        }
                    </View>
                </View>
            </View>
        );
    }


    render() {

        return (

            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Profile</Title>
                    </Body>
                    <Right>
                        {
                            this.state.profileLoading ?
                                <ActivityIndicator size="small" color="white" />
                                : null
                        }

                    </Right>
                </Header>
                <Content style={styles.container}>

                    <View style={styles.topBackground}></View>

                    {this._imageContent()}

                    <View style={{ padding: 15 }}>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='text-width' type='FontAwesome' />
                            <Input placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='Name' value={this.state.authuser_name} onChangeText={(text) => this.setState({ authuser_name: text })} />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='envelope' type='FontAwesome' />
                            <Input placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='Email' value={this.state.authuser_email} onChangeText={(text) => this.setState({ authuser_email: text })} />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='key' type='FontAwesome' />
                            <Input placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='New Password' secureTextEntry={true} value={this.state.authuser_newpassword} onChangeText={(text) => this.setState({ authuser_newpassword: text })} />
                        </Item>

                        <Button rounded block style={[styles.item, styles.loginBtn]} onPress={this._doUpdate}>
                            <Text>Update</Text>
                            {
                                this.state.updateProfileLoading ?
                                    <ActivityIndicator size="small" color="white" />
                                    :
                                    null
                            }
                        </Button>
                    </View>

                </Content>
            </Container>

        );
    }

}

const styles = StyleSheet.create({
    topBackground: {
        backgroundColor: CustomColor.brandPrimary,
        width: Dimensions.get('window').width,
        height: 100
    },
    userImage: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 5,
        flex: 1,
    },
    item: {
        marginBottom: 15,
    },
    itemInput: {
        color: CustomColor.brandPrimary
    },
    itemIcon: {
        color: CustomColor.brandPrimary
    },
    loginBtn: {
        marginTop: 30
    },
    imageOuterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageInnerContainer: {
        width: 130,
        height: 130,
        marginTop: -70
    },
    cameraIconWrapper: {
        borderRadius: 100,
        padding: 5,
        backgroundColor: 'white',
        position: "absolute",
        top: 0,
        right: 0,
    }
});