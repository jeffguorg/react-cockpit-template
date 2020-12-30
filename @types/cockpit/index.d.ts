
namespace Cockpit {
    export namespace DBus {
        interface ClientOptions {
            bus?: "user" | "session" | "system";
            host?: string;
            superuser?: "try" | "requred";
            track?: boolean;
        }
        interface Client extends Loadable {
            close(problem?: string);

            addEventListener(e: "close", callback: (ev: { problem: string }) => any);
            addEventListener(e: "owner", callback: (ev: Event, owner: string) => any);
            addEventListener(e: "notify", callback: (notification: Notification) => any);
            addEventListener(e: "meta", callback: (meta: Meta) => any);

            proxy(): Proxy;
            proxy(interface: string, path: string): Proxy;
            proxy(options: { watch?: boolean }): Proxy;
            proxy(interface: string, path: string, options: { watch?: boolean }): Proxy;

            call(path: string, interface: string, method: string, args: any[] | null, options?: { flags?: string; type?: string; timeout?: number }): Innovacation;
            subscribe(match: {
                interface: string;
                path: string;
                path_namespace: string;
                member: string;
                arg0: string;
            }, callback: () => any): Subscription;
            watch(path: string): Watch;
            watch(options: { path_namespace: string; interface: string; }): Watch;
            notify(notification: Notification);
            meta(meta: Meta);
            publish(path, interface, object, options?: {}): Promise<Published>;
            variant(type: string, value: any);

            options: Object;
            unique_name: string;
        }

        interface Proxy extends Object, Loadable {
            addEventListener(e: "change", callback: (ev: Event) => any);
            addEventListener(e: "signal", callback: (ev: Event, name: string, args: any[]) => any);
            addEventListener(e: string, callback: (ev: Event, ...args: unknown[]) => any);

            call(method: string, args: any[] | null, options?: { flags?: string; type?: string; timeout?: number }): Innovacation;

            readonly client: Client;
            readonly path: string;
            readonly iface: string;
            readonly valid: boolean;
            readonly data: Object;
        }

        interface Variant { }

        interface Removable {
            remove();
        }

        type Meta = Map<string, {
            methods: Map<string, {
                in: string[],
                out: string[],
            }>,
            signals: Map<string, {
                in: string[],
            }>,
            properties: Map<string, {
                flags: string,
                type: string,
            }>,
        }>;

        type Published = Removable;

        type Notification = Map<string, Map<string, Map<string, any> | null>>;

        type Subscription = Removable;
        type Watch = Removable & Promise;

        type Innovacation = Promise<any[]>;
    }


    export namespace File {
        interface BinaryFileOptions {
            binary: true,
            syntax?: { stringify: (value: any) => string, parse: (text: string) => any }
        }
        interface TextFileOptions {
            binary?: false,
            syntax?: { stringify: (value: any) => string, parse: (text: string) => any }
        }

        export interface File<T> {
            read(): ReadPromise<T>;
            replace(content: T | null): WritePromise<T>;
            modify(content: T | null): WritePromise<T>;
            watch(callback: (content: string) => any);
            close();

            readonly path: string;
        }

        interface ReadPromise<T> {
            then(callback: (content: string, tag: string) => any);
            catch(callback: (error: any) => any);
        }

        interface WritePromise<T> {
            then(callback: (tag: string) => any);
            catch(callback: (error: any) => any);
        }
    }


    declare namespace Channel { //TODO
        interface ChannelOptions {
            host?: string;
            payload: null | "echo" | "dbus-json3" | "stream" | "http-stream2" | "websocket-stream1" | "packet" | "fswatch1" | "fslist1" | "fsread1" | "fsreplace1" | "metrics1" ;
            superuser?: "require" | "try";
        }

        interface InitCommand {
            version: 1,
            
        }

        interface Channel<Msg> {
            send(data: Msg);

            command(options: InitCommand)

            readonly valid: boolean;
            readonly binary: boolean;
            readonly options: ChannelOptions;
        }
    }


    declare namespace HTTP {
        interface ClientOptions {
            address?: string;
            port?: number;
            superuser?: boolean;
            headers?: Map<string, string>;
            tls?: {
                authority?: { file: string; } | { data: string; },
                certificate?: { file: string; } | { data: string; },
                key?: { file: string; } | { data: string; },
                validate?: boolean,
            }
        }
        interface Client {
            get(path: string): Request;
            get(path: string, params: Object): Request;
            get(path: string, params: Object, headers: Map<string, string>): Request;
            post(path: string, body: string | Object | null | undefined): Request;
            post(path: string, body: string | Object | null | undefined, headers: Map<string, string>): Request;
            request(options: { body?: string; headers?: Map<string, string>; method: string; params?: Object, path?: string }): Request;
            close();
        }

        interface Request {
            then(callback: (data) => any);
            catch(callback: (exception, data) => any);

            response(callback: (status, headers) => any);
            stream(callback: (data) => any);
            input(data, stream?: boolean);
            close();
        }
    }


    declare namespace Metrics { //TODO
        interface MetricsOptions {
            metrics: Object[];
            source?: "interval" | "direct" | "pmcd";
            archive_source?: "pcp-archive";
        }
        interface Metrics {
            fetch(begin: number | Date, end: number | Date);
            follow();

            // TODO: get types in browser
            series: any;
            meta: any;
            onchanged: () => void;
        }
    }

    declare namespace Process {
        interface SpawnOptions {
            binary?: boolean;
            directory?: string;
            err?: "out" | "ignore" | "pty" | "message";
            host?: string;
            environ?: string[];
            pty?: boolean;
            batch?: number;
            latency?: number;
            superuser?: "try" | "requred";
        }
        interface Process {
            then(callback: (data: string, message?: string) => any);
            catch(callback: (e: Error, data?: string) => any)

            stream(callback: (data) => any);
            input(data: string, stream?: boolean);
            close(reasom?: any);
        }
    }

    declare interface Loadable {
        wait(callback: Function): Promise;
    }

    interface Cockpit {
        dbus(name: string, options?: DBus.ClientOptions): DBus.Client;

        file(path: string, option: File.BinaryFileOptions): Cockpit.File.File<Uint8Array>;
        file(path: string, option?: File.TextFileOptions): Cockpit.File.File<string>;

        http(endpoint: string, option?: HTTP.ClientOptions): HTTP.Client;
        http(option: HTTP.ClientOptions): HTTP.Client;

        spawn(args: string[], options?: Process.SpawnOptions): Process.Process;
        script(script: string, args?: string[], options?: Process.SpawnOptions): Process.Process;

        metrics(interval: number, options?: {}, cache?: string): Metrics.Metrics;

        channel(options: Channel.ChannelOptions & { binary: true }): Channel.Channel<number[] | Uint8Array>;
        channel(options: Channel.ChannelOptions & { binary?: false }): Channel.Channel<string>;

        // localization
        locale(locale: string): void;
        gettext(s: string): string;
        gettext(context: string, string: string): string;
        noop(...args: any[]): any;
        ngettext(ctx?:string, ...args: string[], number: number);
        translate(el?: Element | Element[]);

        // utils
        format(template: string, args: Array | Object): string;
        format(template: string, ...args: any[]): string;
    };
};

declare var cockpit: Cockpit.Cockpit;