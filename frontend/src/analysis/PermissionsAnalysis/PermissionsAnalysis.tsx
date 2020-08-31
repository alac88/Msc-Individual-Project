import React, {
    useEffect
} from 'react';
import './PermissionsAnalysis.scss';

const dangerousPermissions = [
    //Dangerous permissions
    "ACCEPT_HANDOVER",
    "ACCESS_BACKGROUND_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "ACCESS_FINE_LOCATION",
    "ACCESS_MEDIA_LOCATION",
    "ACTIVITY_RECOGNITION",
    "ADD_VOICEMAIL",
    "ANSWER_PHONE_CALLS",
    "BODY_SENSORS",
    "CALL_PHONE",
    "CAMERA",
    "GET_ACCOUNTS",
    "PROCESS_OUTGOING_CALLS",
    "READ_CALENDAR",
    "READ_CALL_LOG",
    "READ_CONTACTS",
    "READ_EXTERNAL_STORAGE",
    "READ_PHONE_NUMBERS",
    "READ_PHONE_STATE",
    "READ_SMS",
    "RECEIVE_MMS",
    "RECEIVE_SMS",
    "RECEIVE_WAP_PUSH",
    "RECORD_AUDIO",
    "SEND_SMS",
    "USE_SIP",
    "WRITE_CALENDAR",
    "WRITE_CALL_LOG",
    "WRITE_CONTACTS",
    "WRITE_EXTERNAL_STORAGE",

    "SYSTEM_ALERT_WINDOW",
    "WRITE_SETTINGS",

    // Not for use by third-party applications
    "ACCESS_CHECKIN_PROPERTIES",
    "ACCOUNT_MANAGER",
    "BIND_APPWIDGET",
    "BLUETOOTH_PRIVILEGED",
    "CALL_PRIVILEDGED",
    "CAPTURE_AUDIO_OUTPUT",
    "CONTROL_LOCATION_UPDATES",
    "DELETE_PACKAGES",
    "DUMP",
    "INSTALL_LOCATION_PROVIDER",
    "INSTALL_PACKAGES",
    "LOCATION_HARDWARE",
    "MEDIA_CONTENT_CONTROL",
    "MODIFY_PHONE_STATE",
    "MOUNT_FORMAT_FILESYSTEMS",
    "MOUNT_UNMOUNT_FILESYSTEMS",
    "READ_LOGS",
    "REBOOT",
    "SET_PROCESS_LIMIT",
    "WRITE_SECURE_SETTINGS",
]

function PermissionsAnalysis(props: any){

    useEffect(() => {
        getSecurityScore();
    }, [props.analysis]);

    function getKeysList(){
        let list = Array();
        let i = 0;
        while (props.analysis[i]){
            props.analysis[i].content.map((key: string) => {
                list.push(key);
            })
            i++;
        }

        return Array.from(new Set(list));
    }

    function getSecurityScore(){
        if (props.analysis.length){
            let scoreList = Array();
            let i = 0;
            while (props.analysis[i]){
                let score = 1;
                // Permissions on personal data
                let nbDangerousPermissions = 0;
                props.analysis[i].content.map((permission: string) => {
                    if (dangerousPermissions.includes(permission) || permission.includes("/dangerous")){
                        // console.log(permission);
                        nbDangerousPermissions++;
                    }
                })
                // console.log(props.analysis[i].name, nbDangerousPermissions);
                score = Math.exp(-nbDangerousPermissions / 8);
                scoreList.push({"name": props.analysis[i].name, "score": Math.round(score*10)/10});
                i++;
            }
            props.callback(scoreList);
        }
    }

    return (
        props.analysis.length ? <div id="permissionsAnalysisContainer">
            <h4>Permissions Analysis</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        {/* <th scope="col">Security Score</th> */}
                        {getKeysList().map((key) => {
                            return <th key={key}>{key}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.analysis.map((app: any) => {
                        return (
                            <tr key={app.name}>
                                <>
                                    <th>{app.name}</th>
                                    {getKeysList().map((key) => {
                                        if (app.content.includes(key)){
                                            return <th key={key+"-result"}>X</th>;

                                        } else {
                                            return <th key={key+"-result"}></th>;
                                        }
                                    })}
                                </>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div> : null
    );
}

export default PermissionsAnalysis;