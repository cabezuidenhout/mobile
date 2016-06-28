import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ListView,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerMatchesActions from '../actions/player_matches_act';
import { Actions } from 'react-native-router-flux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import heroes from '../json/heroes.json';
import factions from '../json/factions.json';
import results from '../json/results.json';
import patches from '../json/patch.json';
import lanes from '../json/lanes.json';
import sortCategories from '../json/sort_categories.json';
import gameModes from '../json/game_mode.json';
import PickerInput from '../components/PickerInput';
import PickerText from '../components/PickerText';

import _ from 'lodash';

import Colors from '../themes/Colors';
import base from '../themes/BaseStyles';
import Fonts from '../themes/Fonts';

export const mapStateToProps = state => ({
    contextId: state.navigationState.contextId,
    legendHex: state.settingsState.legendHex,
    mod: state.settingsState.mod,
    legend: state.settingsState.legend,
    alpha: state.settingsState.alpha,
    secondLegend: state.settingsState.secondLegend
});

export const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(playerMatchesActions, dispatch)
});

var sortedHeroes;
var sortedFactions;
var sortedPatches;
var sortedCategories;
var sortedGameModes;
var sortedResults;
var sortedLanes;

class MatchesSearch extends Component {


    // #DONE:0 Filter by lane
    // TODO:20 Filter by lobby type
    // TODO:0 Filter by date
    // TODO:30 Filter by region
    // TODO:40 Filter by team Heroes
    // TODO:10 Filter by enemy Heroes

    constructor(props) {
        super(props);
        this.state = {
            'hero': false,
            'hero_id': 0,
            'hero_name': 'None',
            'faction': false,
            'faction_id': -1,
            'faction_name': "None",
            'match_limit': "30",
            'patch': false,
            'patch_id': -1,
            'patch_name': "None",
            'sort_category': false,
            'sort_category_id': "match_id",
            'sort_category_name': "Match ID (default)",
            'game_mode': false,
            'game_mode_id': -1,
            'game_mode_name': 'None',
            'result': false,
            'result_id': -1,
            'result_name': 'None',
            'lane': false,
            'lane_id': -1,
            'lane_name': 'None'
        }
        this.togglePicker = this.togglePicker.bind(this);
        this.valuePicked = this.valuePicked.bind(this);
        this.onFilterPressed = this.onFilterPressed.bind(this);
        this.constructPatchesArray = this.constructPatchesArray.bind(this);
        this.constructGameModesArray = this.constructGameModesArray.bind(this);
    }

    componentWillMount() {
        var heroesArray = _.cloneDeep(heroes.result.heroes);
        sortedHeroes = _.sortBy(heroesArray, ['localized_name']);
        sortedHeroes.unshift({"id": 0, "localized_name": "None"});
        sortedFactions = _.cloneDeep(factions);
        sortedFactions.unshift({"id": -1, "localized_name": "None"});
        var patchesArray = _.cloneDeep(patches);
        sortedPatches = this.constructPatchesArray(patchesArray);
        sortedPatches.unshift({"id": -1, "localized_name": "None"});
        sortedCategories = _.cloneDeep(sortCategories);
        sortedCategories.unshift({"id": "match_id", localized_name: "Match ID (default)"});
        var gameModesArray = _.cloneDeep(gameModes);
        sortedGameModes = this.constructGameModesArray(gameModesArray);
        sortedGameModes.unshift({"id": -1, "localized_name": "None"});
        sortedResults = _.cloneDeep(results);
        sortedResults.unshift({"id": -1, "localized_name": "None"});
        sortedLanes = _.cloneDeep(lanes);
        sortedLanes.unshift({"id": -1, "localized_name": "None"});
    }

    onFilterPressed() {

        // TODO:50 Modify projects based on sort_category_id. Need to wait until desc is implemented by YASP.

        var defaultProjects = ['hero_id', 'game_mode', 'start_time', 'duration', 'player_slot', 'radiant_win', 'kills', 'deaths', 'assists'];
        this.props.actions.changeSortedby(this.state.sort_category_id);
        this.props.actions.fetchMatches(this.props.contextId, this.state.match_limit, defaultProjects,
                                        this.state.sort_category_id, this.state.hero_id,
                                        this.state.result_id, this.state.faction_id, this.state.game_mode_id,
                                        this.state.lane_id, this.state.patch_id);
        Actions.pop();
    }

    togglePicker(name) {
        var newState = _.cloneDeep(this.state);
        newState[name] = !newState[name];
        this.setState(newState);
    }

    valuePicked(pickerName, valueKey, labelKey, pickedValue, pickedLabel) {
        var newState = _.cloneDeep(this.state);
        if(pickedValue === undefined) {
            pickedValue = 0;
            pickedLabel = 'None';
        }
        newState[valueKey] = pickedValue;
        newState[labelKey] = pickedLabel;
        newState[pickerName] = false;
        this.setState(newState);
    }

    constructPatchesArray(patchesArray) {
        var constructedPatchesArray = [];
        for(i = 0; i < patchesArray.length; i++) {
            constructedPatchesArray.push({"id": i, "localized_name": patchesArray[i].name});
        }
        return constructedPatchesArray;
    }

    constructGameModesArray(gameModesArray) {
        var constructedGameModesArray = [];
        for(var gameMode in gameModesArray) {
            constructedGameModesArray.push({"id": gameModesArray[gameMode].id, "localized_name": gameModesArray[gameMode].name});
        }
        return constructedGameModesArray;
    }

    render() {

        var picker;
        console.log(this.state);

        if(this.state['hero']) {
            picker = <PickerInput
                        selectedValue = {this.state.hero_id}
                        selectedLabel = {this.state.hero_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('hero', 'hero_id', 'hero_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('hero')}
                        items = {sortedHeroes}
                        />
        }

        if(this.state['faction']) {
            picker = <PickerInput
                        selectedValue = {this.state.faction_id}
                        selectedLabel = {this.state.faction_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('faction', 'faction_id', 'faction_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('faction')}
                        items = {sortedFactions}
                        />
        }

        if(this.state['patch']) {
            picker = <PickerInput
                        selectedValue = {this.state.patch_id}
                        selectedLabel = {this.state.patch_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('patch', 'patch_id', 'patch_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('patch')}
                        items = {sortedPatches}
                        />
        }

        if(this.state['sort_category']) {
            picker = <PickerInput
                        selectedValue = {this.state.sort_category_id}
                        selectedLabel = {this.state.sort_category_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('sort_category', 'sort_category_id', 'sort_category_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('sort_category')}
                        items = {sortedCategories}
                        />
        }

        if(this.state['game_mode']) {
            picker = <PickerInput
                        selectedValue = {this.state.game_mode_id}
                        selectedLabel = {this.state.game_mode_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('game_mode', 'game_mode_id', 'game_mode_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('game_mode')}
                        items = {sortedGameModes}
                        />
        }

        if(this.state['result']) {
            picker = <PickerInput
                        selectedValue = {this.state.result_id}
                        selectedLabel = {this.state.result_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('result', 'result_id', 'result_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('result')}
                        items = {sortedResults}
                        />
        }

        if(this.state['lane']) {
            picker = <PickerInput
                        selectedValue = {this.state.lane_id}
                        selectedLabel = {this.state.lane_name}
                        onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('lane', 'lane_id', 'lane_name', selectedValue, selectedLabel)}
                        onPickerCancel = {() => this.togglePicker('lane')}
                        items = {sortedLanes}
                        />
        }

        return (
            <View style = {styles.container}>
                <ScrollView>

                        <View style = {[styles.formContainer, {backgroundColor: this.props.mod}]}>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Number of matches</Text>
                                </View>
                                <TextInput
                                    value = {this.state.match_limit}
                                    style = {[styles.limitInput, { backgroundColor: this.props.alpha, color: this.props.secondLegend}]}
                                    autoCorrect = {false}
                                    keyboardType = 'numeric'
                                    selectionColor = 'white'
                                    onChange = {(event) => {
                                        this.setState({
                                            match_limit: event.nativeEvent.text
                                        });
                                    }}
                                    onFocus = {() => {
                                        this.setState({
                                            match_limit: ""
                                        });
                                    }}/>
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Sort By</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('sort_category')}
                                    title = {this.state.sort_category_name}
                                    selectedValue = {this.state.sort_category_id}
                                    selectedLabel = {this.state.sort_category_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('sort_category', 'sort_category_id', 'sort_category_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('sort_category')}
                                    items = {sortedCategories}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Hero</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('hero')}
                                    title = {this.state.hero_name}
                                    selectedValue = {this.state.hero_id}
                                    selectedLabel = {this.state.hero_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('hero', 'hero_id', 'hero_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('hero')}
                                    items = {sortedHeroes}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Faction</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('faction')}
                                    title = {this.state.faction_name}
                                    selectedValue = {this.state.faction_id}
                                    selectedLabel = {this.state.faction_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('faction', 'faction_id', 'faction_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('faction')}
                                    items = {sortedFactions}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Result</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('result')}
                                    title = {this.state.result_name}
                                    selectedValue = {this.state.result_id}
                                    selectedLabel = {this.state.result_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('result', 'result_id', 'result_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('result')}
                                    items = {sortedResults}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Game Mode</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('game_mode')}
                                    title = {this.state.game_mode_name}
                                    selectedValue = {this.state.game_mode_id}
                                    selectedLabel = {this.state.game_mode_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('game_mode', 'game_mode_id', 'game_mode_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('game_mode')}
                                    items = {sortedGameModes}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Lane</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('lane')}
                                    title = {this.state.lane_name}
                                    selectedValue = {this.state.lane_id}
                                    selectedLabel = {this.state.lane_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('lane', 'lane_id', 'lane_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('lane')}
                                    items = {sortedLanes}
                                    />
                            </View>

                            <View style = {styles.pickerItem}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style = {[styles.pickerTitle, {color: this.props.legend}]}>Patch</Text>
                                </View>
                                <PickerText
                                    onPress = {() => this.togglePicker('patch')}
                                    title = {this.state.patch_name}
                                    selectedValue = {this.state.patch_id}
                                    selectedLabel = {this.state.patch_name}
                                    onPickerDone = {(selectedValue, selectedLabel) => this.valuePicked('patch', 'patch_id', 'patch_name', selectedValue, selectedLabel)}
                                    onPickerCancel = {() => this.togglePicker('patch')}
                                    items = {sortedPatches}
                                    />
                            </View>



                        </View>
                        <TouchableOpacity  onPress = {this.onFilterPressed} style = {styles.filterContainer}>
                            <View style = {[styles.filterIconContainer, {backgroundColor: this.props.mod}]}>
                                <FontAwesome name = "filter" size = {20} allowFontScaling = {false} color = {this.props.legend}/>
                            </View>
                            <View style = {[styles.filterButton, {backgroundColor: this.props.mod}]}>
                                <Text style = {[styles.filterButtonText, {color: this.props.legend}]}>Filter Matches</Text>
                            </View>
                        </TouchableOpacity>


                </ScrollView>
                {picker}
            </View>

        )

    }

}

const baseStyles = _.extend(base.general, {
    formContainer: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 3
    },
    pickerTitleContainer: {
        marginBottom: 5
    },
    pickerTitle: {
        fontFamily: Fonts.base,
        fontSize: 18,
        fontWeight: 'bold'
    },
    pickerItem: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10
    },
    filterContainer: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1
    },
    filterButton: {
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 2
    },
    filterIconContainer: {
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 8,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1
    },
    filterButtonText: {
        fontFamily: Fonts.base,
        fontSize: 16
    },
    limitInput: {
        height: 40,
        fontSize: 14,
        fontFamily: Fonts.base,
        paddingHorizontal: 20,
        paddingVertical: 3,
        borderRadius: 3
    }
});

const styles = StyleSheet.create(baseStyles);

export default connect(mapStateToProps, mapDispatchToProps)(MatchesSearch);