import {
    EC2Client,
    StartInstancesCommand,
    StartInstancesCommandInput,
    StartInstancesCommandOutput,
    StopInstancesCommand,
    StopInstancesCommandInput,
    StopInstancesCommandOutput
} from "@aws-sdk/client-ec2";

export default class Ec2Service {
    input: StopInstancesCommandInput | StartInstancesCommandInput
    client: EC2Client
    constructor(instanceId: string) {
        this.input = {
            InstanceIds: [
                instanceId
            ]
        }
        this.client = new EC2Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
            }
        });
    }

    async instanceActionStop(): Promise<StopInstancesCommandOutput> {
        const command = new StopInstancesCommand(this.input);
        const response = await this.client.send(command);
        return response;
    }

    async instanceActionStart(): Promise<StartInstancesCommandOutput> {
        const command = new StartInstancesCommand(this.input);
        const response = await this.client.send(command);
        return response;
    }

    // async runInstanceTerminalCommand():Promise<RunInstancesCommandOutput>{
    //     const input:RunInstancesCommandInput = {

    //     }
    // }
}
