import { Table } from "@radix-ui/themes";
import Dashboard from "../../components/Dashboard";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../db/supabaseClient";
import PlayerRow from "../../components/PlayerRow";
import {
  MultiSelect,
  Modal,
  Button,
  TextInput,
  Flex,
  NativeSelect,
  ScrollArea,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";

const Players = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [playersData, setPlayersData] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [mice, setMice] = useState([]);
  const [keyboards, setKeyboards] = useState([]);
  const [headsets, setHeadsets] = useState([]);
  const [mousepads, setMousepads] = useState([]);
  const [earphones, setEarphones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    value,
  } = useForm({
    defaultValues: {
      game_id: [],
    },
  });

  useEffect(() => {
    fetchPlayersData();
    fetchData("monitors", setMonitors, "monitor");
    fetchData("mice", setMice, "mouse");
    fetchData("keyboards", setKeyboards, "keyboard");
    fetchData("headsets", setHeadsets, "headset");
    fetchData("mousepads", setMousepads, "mousepad");
    fetchData("earphones", setEarphones, "earphone");
    fetchData("teams", setTeams, "team");
    fetchData("countries", setCountries, "country");
    fetchGamesData();
  }, []);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const onSubmit = async (e) => {
    const {
      game_id,
      name,
      fullname,
      birthday,
      image_url,
      team_id,
      country_id,
      monitor_id,
      mouse_id,
      keyboard_id,
      headset_id,
      mousepad_id,
      earphone_id,
    } = e;
    setLoading(true);
    console.log("first submit", e);
    const { data: player, error: player_error } = await supabase
      .from("players")
      .insert({
        name: name,
        fullname: fullname,
        birthday: birthday,
        image_url: image_url,
        team: team_id,
        country: country_id,
        monitor: monitor_id,
        mouse: mouse_id,
        keyboard: keyboard_id,
        headset: headset_id,
        mousepad: mousepad_id,
        earphone: earphone_id,
      })
      .select();

    if (player_error) {
      console.log("ERROR", player_error);
      setErrorMessage(player_error.message);
      setLoading(false);
    } else {
      setSuccessMessage("Player added successfully!");
      reset();
      fetchPlayersData();
      console.log("PLAYER EVENT", e);
      console.log("PLAYER DATA", player);
      setLoading(false);
    }
    const promises = game_id.map((game) => {
      return supabase
        .from("games_has_players")
        .insert({
          game_id: Number(game),
          player_id: player[0].player_id,
        })
        .select();
    });

    try {
      const results = await Promise.all(promises);
      console.log(results);
      setSuccessMessage("Player added successfully!");
      reset();
      fetchPlayersData();
      console.log("PLAYER_PLAYS EVENT", e);
      console.log("PLAYER_PLAYS DATA", results);
    } catch (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
    }
  };

  const fetchPlayersData = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("player_id", { ascending: false });

      if (error) {
        throw error;
      }
      console.log("players", data);
      setPlayersData(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  };

  const fetchData = async (table, set, name) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }
      console.log(table, data);
      set(
        data.map((data) => ({
          label: data.name,
          value: data[name + "_id"],
        })),
      );
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  };

  const fetchGamesData = async () => {
    try {
      const { data, error } = await supabase.from("games").select("*");
      if (error) {
        throw error;
      }
      console.log("games data", data);
      setGames(
        data.map((game) => ({
          label: game.name,
          value: String(game.game_id),
        })),
      );
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  };

  return (
    <Dashboard>
      <Modal
        size="md"
        opened={opened}
        onClose={close}
        title="Add Player"
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <MultiSelect
            data={games}
            label="Game"
            placeholder="Select game"
            searchable
            {...register("game_id")}
            onChange={(i) => {
              setValue("game_id", i);
              console.log("game_id", i);
            }}
          />

          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}

          <TextInput
            label="Full Name"
            placeholder="Full Name"
            mt="sm"
            {...register("fullname", {
              required: {
                value: true,
                message: "Preencha o campo de nome completo",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
            onChange={handleInputChange}
          />
          {errors.fullname && (
            <p className="text-sm text-red-600">{errors.fullname.message}</p>
          )}

          <DateInput
            mt="sm"
            label="Birthday"
            placeholder="YYYY/MM/DD"
            {...register("birthday")}
            onChange={(i) => {
              setValue("birthday", i);
              console.log("birthday", i);
            }}
          />
          {errors.birthday && (
            <p className="text-sm text-red-600">{errors.birthday.message}</p>
          )}

          <TextInput
            label="Image"
            placeholder="Image URL"
            mt="sm"
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
            onChange={handleInputChange}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}

          <NativeSelect
            label="Team"
            mt="sm"
            data={teams}
            {...register("team_id")}
          />

          <NativeSelect
            label="Countries"
            mt="sm"
            data={countries}
            {...register("country_id")}
          />

          <NativeSelect
            label="Monitor"
            mt="sm"
            data={monitors}
            {...register("monitor_id")}
          />

          <NativeSelect
            label="Mouse"
            mt="sm"
            data={mice}
            {...register("mouse_id")}
          />

          <NativeSelect
            label="Keyboard"
            mt="sm"
            data={keyboards}
            {...register("keyboard_id")}
          />

          <NativeSelect
            label="Headset"
            mt="sm"
            data={headsets}
            {...register("headset_id")}
          />

          <NativeSelect
            label="Mousepad"
            mt="sm"
            data={mousepads}
            {...register("mousepad_id")}
          />

          <NativeSelect
            label="Earphone"
            mt="sm"
            data={earphones}
            {...register("earphone_id")}
          />

          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm" color="grape">
              {loading ? <Loader color="white" size={23} /> : "Add Player"}
            </Button>
          </Flex>

          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>

      <Flex justify="end" pb="md">
        <Button onClick={open}>Add Player</Button>
      </Flex>

      <Table.Root variant="surface" size={3} layout={"fixed"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {playersData.map((player) => (
            <PlayerRow
              key={player.player_id}
              player={player}
              playersData={playersData}
              setPlayersData={setPlayersData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              fetchPlayersData={fetchPlayersData}
              games={games}
              monitors={monitors}
              mice={mice}
              keyboards={keyboards}
              headsets={headsets}
              mousepads={mousepads}
              earphones={earphones}
              countries={countries}
              teams={teams}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Dashboard>
  );
};

export default Players;
